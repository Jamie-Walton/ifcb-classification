from django.http.response import JsonResponse
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.http import HttpResponse, FileResponse
from .serializers import ClassOptionSerializer, FrontEndPackageSerializer, TargetSerializer, TimeSeriesOptionSerializer, BinSerializer, NoteSerializer
from .models import ClassOption, FrontEndPackage, TimeSeriesOption, Bin, Target, Note
from .services import create_targets, get_files, get_days, get_rows, saveClassifications, sync_autoclass, filter_notes, create_class_zip, search_targets
import requests
import math
import pandas as pd
import numpy as np
from datetime import date
import os
from backend.settings import MEDIA_ROOT

class TimeSeriesOptionView(viewsets.ModelViewSet):
    serializer_class = TimeSeriesOptionSerializer
    queryset = TimeSeriesOption.objects.all()

class BinView(viewsets.ModelViewSet):
    serializer_class = BinSerializer
    queryset = Bin.objects.all()


@api_view(('GET',))
def get_classes(request, timeseries):
    timeseries_obj = TimeSeriesOption.objects.get(name=timeseries)
    classes = ClassOption.objects.filter(timeseries=timeseries_obj, in_use=True).order_by('display_name')
    serializer = ClassOptionSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(('GET',))
def get_notebook(request):
    data = Note.objects.all().order_by('-date')
    serializer = NoteSerializer(data, context={'request': request}, many=True)
    
    return Response(serializer.data)


@api_view(('GET',))
def get_notebook_filters(request):
    queryset = Note.objects.all()

    options = {
        'authors': queryset.values('author').distinct(),
        'bins': queryset.values('file').distinct(),
        'timeseries': queryset.values('timeseries').distinct(),
        'ifcbs': queryset.values('ifcb').distinct(),
    }

    package = FrontEndPackage(bin={}, options=options)
    front_end_package = FrontEndPackageSerializer(package)

    return Response(front_end_package.data)


@api_view(('POST',))
def filter_notebook(request):
    queryset = filter_notes(request.data)
    serializer = NoteSerializer(queryset, many=True)
    
    return Response(serializer.data)


@api_view(('GET',))
def get_notes(request, timeseries, file, image):
    notes = Note.objects.filter(timeseries=timeseries, file=file, image=image)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)


@api_view(('POST',))
def add_note(request):
    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(('DELETE',))
def delete_note(request, id):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    note = Note.objects.get(id=id)
    note.delete()
    return Response(status=status.HTTP_201_CREATED)


@api_view(('PUT',))
def flag_note(request, id):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    note = Note.objects.get(id=id)
    note.flag = not note.flag
    note.save()
    return Response(status=status.HTTP_201_CREATED)


@api_view(('GET',))
def get_target_classifiers(request):
    queryset = Target.objects.all()

    options = {
        'classifiers': queryset.values('editor').distinct(),
    }

    package = FrontEndPackage(bin={}, options=options)
    front_end_package = FrontEndPackageSerializer(package)

    return Response(front_end_package.data)


@api_view(('GET',))
def new_targets(request, timeseries, file, sort):
    if request.method == 'GET':
        b = Bin.objects.get(timeseries=timeseries, file=file)
        if sort == 'AZ':
            model_targets = Target.objects.filter(bin=b).order_by('class_name', '-height')
        elif sort == 'ZA':
            model_targets = Target.objects.filter(bin=b).order_by('-class_name', '-height')
        elif sort == 'LS':
            model_targets = Target.objects.filter(bin=b).order_by('-height')
        elif sort == 'SL':
            model_targets = Target.objects.filter(bin=b).order_by('height')

        target_serializer = TargetSerializer(model_targets, many=True)
        return Response(target_serializer.data)


@api_view(('PUT',))
def save(request, timeseries, file, sort):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    b = Bin.objects.get(timeseries=timeseries, file=file)

    targets = Target.objects.filter(bin=b)
    
    if sort == 'AZ':
        targets = targets.order_by('class_name', '-height')
    elif sort == 'ZA':
        targets = targets.order_by('-class_name', '-height')
    elif sort == 'LS':
        targets = targets.order_by('-height')
    elif sort == 'SL':
        targets = targets.order_by('height')
    
    for i in range(len(targets)):
        target = targets[i]
        serializer = TargetSerializer(target, data=request.data[i])
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(('GET',))
def saveMAT(request, ifcb, file):
    b = Bin.objects.get(ifcb=ifcb, file=file)
    saveClassifications(b, ifcb, file)
    file_name = file + '_' + ifcb + '.mat'
    path = os.path.join(MEDIA_ROOT, file_name)
    file = open(path, 'rb')
    response = HttpResponse(file, headers = {
        'Content-Type': 'application/x-matlab-data',
        'Content-Disposition': 'attachment; filename="' + file_name + '"',
        })
    return response

@api_view(('GET',))
def download_class(request, classname, include, exclude, number):
    path = create_class_zip(classname, include, exclude, number)
    zip_file = open(path, 'rb')
    return FileResponse(zip_file)


@api_view(('POST',))
def basic_search_targets(request):
    queryset = search_targets(request.data)
    if type(queryset) != Target:
        serializer = TargetSerializer(queryset, many=True)
    else:
        serializer = TargetSerializer(queryset, many=False)
    
    return Response(serializer.data)


@api_view(('GET',))
def get_last_edit(request, user):
    target = Target.objects.filter(editor=user).order_by('-date')[0]
    bin = {
        'timeseries': target.bin.timeseries,
        'file': target.bin.file,
    }

    package = FrontEndPackage(bin=bin, options={'target': target.number})
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)



@api_view(('POST',))
def retrieve_bins(request):
    bins = np.unique(np.array(request.data))
    queryset = Bin.objects.filter(id__in=bins)
    if type(queryset) != Bin:
        serializer = BinSerializer(queryset, many=True)
    else:
        serializer = BinSerializer(queryset, many=False)
    
    return Response(serializer.data)


@api_view(('GET',))
def sync(request, timeseries, year, day, file):
    b = Bin.objects.get(timeseries=timeseries, file=file)
    b.delete()
    create_targets(timeseries, year, day, file)


@api_view(('PUT',))
def edit_target(request, timeseries, file, number):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    b = Bin.objects.get(timeseries=timeseries, file=file)
    t = Target.objects.get(bin=b, number=number)
    serializer = TargetSerializer(t, data=request.data,context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(('PUT',))
def edit_targetrow(request, timeseries, file, sort, startInd, endInd):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    b = Bin.objects.get(timeseries=timeseries, file=file)
    if sort == 'AZ':
        targets = Target.objects.filter(bin=b).order_by('class_name', '-height')[startInd:endInd+1]
    elif sort == 'ZA':
        targets = Target.objects.filter(bin=b).order_by('-class_name', '-height')[startInd:endInd+1]
    elif sort == 'LS':
        targets = Target.objects.filter(bin=b).order_by('-height')[startInd:endInd+1]
    elif sort == 'SL':
        targets = Target.objects.filter(bin=b).order_by('height')[startInd:endInd+1]
    for i in range(len(targets)):
        target = targets[i]
        t = Target.objects.get(bin=b, number=target.number)
        serializer = TargetSerializer(t, data=request.data[i],context={'request': request})
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(('PUT',))
def edit_all(request, timeseries, file, sort, className, classAbbr):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    b = Bin.objects.get(timeseries=timeseries, file=file)

    #queryset = Target.objects.all().iterator(chunk_size=200)
    filtered = Target.objects.filter(bin=b)
    
    if sort == 'AZ':
        filtered = filtered.order_by('class_name', '-height')
    elif sort == 'ZA':
        filtered = filtered.order_by('-class_name', '-height')
    elif sort == 'LS':
        filtered = filtered.order_by('-height')
    elif sort == 'SL':
        filtered = filtered.order_by('height')
    
    targets = filtered.iterator(chunk_size=200)
    
    for target in targets:
        t = Target.objects.get(bin=b, number=target.number)
        serializer = TargetSerializer(t, data=\
            {'id': t.id, 'bin': b.id, 'number': t.number, 'height': t.height, 'width': t.width, \
                'class_name': className, 'class_abbr': classAbbr},context={'request': request})
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(('PUT',))
def undo(request, timeseries, file, set):
    b = Bin.objects.get(timeseries=timeseries, file=file)
    targets = Target.objects.filter(bin=b, set=set)
    for i in range(len(targets)):
        target = targets[i]
        t = Target.objects.get(bin=b, number=target.number)
        serializer = TargetSerializer(t, data=request.data[i],context={'request': request})
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(('GET',))
def new_rows(request, timeseries, file, sort, scale, phytoguide):
    b = Bin.objects.get(timeseries=timeseries, file=file)
    rows = get_rows(b, sort, scale, phytoguide)

    options = {
        'rows': rows
    }

    package = FrontEndPackage(bin={}, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_timeseries(request, timeseries_name):
    
    volume_response = requests.get('http://128.114.25.154:8000/' + timeseries_name + '/api/feed/temperature/start/01-01-2015/end/' + date.today().strftime('%Y-%m-%d'))
    volume = volume_response.json()
    recent_file = volume[0]['pid'][35:51]

    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_file(request, timeseries, file, sort, scale, phytoguide):
    
    volume_response = requests.get('http://128.114.25.154:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/' + date.today().strftime('%Y-%m-%d'))
    volume = volume_response.json()

    timeline_response = requests.get('http://128.114.25.154:8000/api/time-series/n_images?resolution=day&dataset=' + timeseries)
    timeline = timeline_response.json()

    present_year = int(timeline['x'][len(timeline['x'])-1][0:4])
    last_year = int(timeline['x'][0][0:4])
    year_options = list(range(int(last_year), int(present_year)+1))

    year = file[1:5]
    day = file[5:7] + '-' + file[7:9]
    day_options, filled_days = get_days(timeline, year)
    if not Bin.objects.filter(file=file):
        ifcb = create_targets(timeseries, year, day, file)
    
    file_options = get_files(volume, date=year+'-'+day)
    
    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = ['All'] + list(range(1, num_sets+1))

    b = Bin.objects.get(file=file)
    ifcb = b.ifcb
    rows = get_rows(b, sort, scale, phytoguide)
    
    bin = {
        'timeseries': timeseries, 
        'ifcb': ifcb,
        'year': year, 
        'day': day, 
        'file': file,
    }
    
    options = {
        'year_options': year_options,
        'day_options': day_options,
        'file_options': file_options,
        'set_options': set_options,
        'rows': rows,
        'filled_days': filled_days,
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_day(request, timeseries, year, day):
    
    dates = pd.date_range(start='1-1-' + year, end='12-31-' + year)
    day = str(dates[day])[:10]

    volume_response = requests.get('http://128.114.25.154:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/' + date.today().strftime('%Y-%m-%d'))
    volume = volume_response.json()

    df = pd.DataFrame(volume)
    index = int(df[df['date'].str.contains(day)].index.values[0])
    recent_file = volume[index]['pid'][35:51]
    
    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, set=1, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)
    
    

@api_view(('GET',))
def new_year(request, timeseries, year):
    
    volume_response = requests.get('http://128.114.25.154:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/' + date.today().strftime('%Y-%m-%d'))
    volume = volume_response.json()

    full_year = [x for x in volume if year in x['date']]
    day = full_year[len(full_year)-1]['date'][:10]
    
    df = pd.DataFrame(volume)
    index = int(df[df['date'].str.contains(day)].index.values[0])
    recent_file = volume[index]['pid'][35:51]

    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)