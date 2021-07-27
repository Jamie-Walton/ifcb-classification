from django.http.response import JsonResponse
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import ClassOptionSerializer, FrontEndPackageSerializer, TargetSerializer, TimeSeriesOptionSerializer, BinSerializer, NoteSerializer
from .models import ClassOption, FrontEndPackage, TimeSeriesOption, Bin, Target, Note
from .services import create_targets, get_files, get_days, get_rows
import requests
import math
import pandas as pd
import re

class TimeSeriesOptionView(viewsets.ModelViewSet):
    serializer_class = TimeSeriesOptionSerializer
    queryset = TimeSeriesOption.objects.all()

class BinView(viewsets.ModelViewSet):
    serializer_class = BinSerializer
    queryset = Bin.objects.all()


@api_view(('GET',))
def get_classes(request, timeseries):
    timeseries_obj = TimeSeriesOption.objects.get(name=timeseries)
    classes = ClassOption.objects.filter(timeseries=timeseries_obj)
    serializer = ClassOptionSerializer(classes, many=True)
    return Response(serializer.data)

@api_view(('GET',))
def get_notes(request, timeseries, file):
    notes = Note.objects.filter(timeseries=timeseries, file=file)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(('POST',))
def add_note(request):
    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(('GET',))
def new_targets(request, timeseries, file, set, sort):
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

        if set == math.ceil((len(model_targets))/500):
            start = 500*(set-1)
            end = len(model_targets)
        else:
            start = 500*(set-1)
            end = start+500

        target_serializer = TargetSerializer(model_targets[start:end], many=True)
        return Response(target_serializer.data)

@api_view(('PUT',))
def save(request, timeseries, file, set, sort):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    b = Bin.objects.get(timeseries=timeseries, file=file)

    targets = Target.objects.filter(bin=b)
    if set == math.ceil((len(targets))/500):
        start = 500*(set-1)
        end = len(targets)
    else:
        start = 500*(set-1)
        end = start+500
    
    if sort == 'AZ':
        targets = targets.order_by('class_name', '-height')[start:end]
    elif sort == 'ZA':
        targets = targets.order_by('-class_name', '-height')[start:end]
    elif sort == 'LS':
        targets = targets.order_by('-height')[start:end]
    elif sort == 'SL':
        targets = targets.order_by('height')[start:end]
    
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
def edit_all(request, timeseries, file, set, sort, className, classAbbr):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    b = Bin.objects.get(timeseries=timeseries, file=file)

    targets = Target.objects.filter(bin=b)
    if set == math.ceil((len(targets))/500):
        start = 500*(set-1)
        end = len(targets)
    else:
        start = 500*(set-1)
        end = start+500
    
    if sort == 'AZ':
        targets = targets.order_by('class_name', '-height')[start:end]
    elif sort == 'ZA':
        targets = targets.order_by('-class_name', '-height')[start:end]
    elif sort == 'LS':
        targets = targets.order_by('-height')[start:end]
    elif sort == 'SL':
        targets = targets.order_by('height')[start:end]
    
    for i in range(len(targets)):
        target = targets[i]
        t = Target.objects.get(bin=b, number=target.number)
        serializer = TargetSerializer(t, data=\
            {'id': t.id, 'bin': b.id, 'number': t.number, 'height': t.height, 'width': t.width, \
                'class_name': className, 'class_abbr': classAbbr},context={'request': request})
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(('GET',))
def new_rows(request, timeseries, file, set, sort):
    b = Bin.objects.get(timeseries=timeseries, file=file)
    rows = get_rows(b, set, sort)

    options = {
        'rows': rows
    }

    package = FrontEndPackage(bin={}, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_timeseries(request, timeseries_name, sort):
    
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/volume')
    volume = volume_response.json()
    year = volume[len(volume)-1]['day'][0:4]
    day = volume[len(volume)-1]['day'][5:]
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    bin_url = bins['pid']
    first_file = re.split('/|_', bin_url)[4]

    if not Bin.objects.filter(year=year, day=day):
        ifcb = create_targets(timeseries_name, year, day, first_file)
    
    last_year = int(volume[0]['day'][0:4])
    year_options = list(range(last_year, int(year)+1))
    day_options = get_days(volume, year)
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries_name)

    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries_name, file=first_file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    b = Bin.objects.get(file=first_file)
    ifcb = b.ifcb
    rows = get_rows(b, 1, sort)
    edited = b.edited

    options = {
        'year_options': year_options,
        'day_options': day_options,
        'file_options': file_options,
        'set_options': set_options,
        'rows': rows
    }

    bin = {
        'timeseries': timeseries_name, 
        'ifcb': ifcb,
        'year': year, 
        'day': day, 
        'file': first_file,
        'edited': edited
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_file(request, timeseries, file, sort):
    year = file[1:5]
    day = file[5:7] + '-' + file[7:9]
    if not Bin.objects.filter(file=file):
        ifcb = create_targets(timeseries, year, day, file)
    
    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    b = Bin.objects.get(file=file)
    ifcb = b.ifcb
    rows = get_rows(b, 1, sort)
    edited = b.edited
    
    bin = {
        'timeseries': timeseries, 
        'ifcb': ifcb,
        'year': year, 
        'day': day, 
        'file': file,
        'edited': edited
    }
    
    options = {
        'year_options': 'NA',
        'day_options': 'NA',
        'file_options': 'NA',
        'set_options': set_options,
        'rows': rows
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_day(request, timeseries, year, day, sort):
    
    dates = pd.date_range(start='1-1-' + year, end='12-31-' + year)
    day = str(dates[day])[5:10]
    
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/volume')
    volume = volume_response.json()
    
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    bin_url = bins['pid']
    first_file = re.split('/|_', bin_url)[4]

    if not Bin.objects.filter(year=year, day=day):
        ifcb = create_targets(timeseries, year, day, first_file)
    
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries)

    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=first_file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    b = Bin.objects.get(file=first_file)
    ifcb = b.ifcb
    rows = get_rows(b, 1, sort)
    edited = b.edited
    
    bin = {
        'timeseries': timeseries,
        'ifcb': ifcb,
        'year': year, 
        'day': day, 
        'file': first_file,
        'edited': edited,
    }
    
    options = {
        'year_options': 'NA',
        'day_options': 'NA',
        'file_options': file_options,
        'set_options': set_options,
        'rows': rows
    }

    package = FrontEndPackage(bin=bin, set=1, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)
    
    

@api_view(('GET',))
def new_year(request, timeseries, year, sort):
    
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/volume')
    volume = volume_response.json()

    day_options = get_days(volume, year)
    full_year = [x for x in volume if year in x['day']]
    day = full_year[len(full_year)-1]['day'][5:10]
    
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    file_options = get_files(int(full_year[len(full_year)-1]['bin_count']), bins, timeseries)
    first_file = re.split('/|_', bins['pid'])[4]

    if not Bin.objects.filter(year=year, day=day):
        ifcb = create_targets(timeseries, year, day, first_file)

    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=first_file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))
    
    b = Bin.objects.get(file=first_file)
    ifcb = b.ifcb
    rows = get_rows(b, 1, sort)
    edited = b.edited

    options = {
        'year_options': 'NA',
        'day_options': day_options,
        'file_options': file_options,
        'set_options': set_options,
        'rows': rows
    }

    bin = {
        'timeseries': timeseries,
        'ifcb': ifcb,
        'year': year, 
        'day': day, 
        'file': first_file,
        'edited': edited
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)