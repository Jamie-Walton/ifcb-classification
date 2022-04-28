from django.http.response import JsonResponse
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.http import HttpResponse, FileResponse
from .serializers import PublicBinSerializer, PublicTargetSerializer, FrontEndPackageSerializer
from .models import PublicBin, PublicTarget, PublicClassification, FrontEndPackage, Classifier
from .services import create_public_targets, get_files, get_days, get_rows, get_filled_days
import requests
import math
import pandas as pd
import numpy as np
import datetime
import os
from backend.settings import MEDIA_ROOT


####### TIME SETUP #######

class PublicBinView(viewsets.ModelViewSet):
    serializer_class = PublicBinSerializer
    queryset = PublicBin.objects.all()



@api_view(('POST',))
def retrieve_bins(request):
    bins = np.unique(np.array(request.data))
    queryset = PublicBin.objects.filter(id__in=bins)
    if type(queryset) != PublicBin:
        serializer = PublicBinSerializer(queryset, many=True)
    else:
        serializer = PublicBinSerializer(queryset, many=False)
    
    return Response(serializer.data)


####### TARGETS #######

@api_view(('GET',))
def new_targets(request, timeseries, file, user):
    if request.method == 'GET':
        b = PublicBin.objects.get(timeseries=timeseries, file=file)
        model_targets = PublicTarget.objects.filter(bin=b).filter(classifier__user=user).order_by('class_name', '-height')

        target_serializer = PublicTargetSerializer(model_targets, many=True)
        return Response(target_serializer.data)


@api_view(('PUT',))
def edit_target(request, timeseries, file, number, user):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    b = PublicBin.objects.get(timeseries=timeseries, file=file)
    t = PublicTarget.objects.filter(bin=b, number=number, classifier__user=user).exclude(classifier__user='Auto Classifier')
    if not t.exists():
        autotarget = PublicTarget.objects.get(bin=b, number=number)
        classifier = Classifier.objects.get(user=user)
        classifier.targets.remove(autotarget)
        b.target_set.create(number=0, width=0, height=0, \
            class_name='', class_abbr='', class_id='', \
            date=datetime.date.today())
        t = PublicTarget.objects.get(bin=b, number=0)
    serializer = PublicTargetSerializer(t, data=request.data,context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(('PUT',))
def undo(request, timeseries, file, set):

    b = PublicBin.objects.get(timeseries=timeseries, file=file)
    targets = PublicTarget.objects.filter(bin=b, set=set)
    for i in range(len(targets)):
        target = targets[i]
        t = PublicTarget.objects.get(bin=b, number=target.number)
        serializer = PublicTargetSerializer(t, data=request.data[i],context={'request': request})
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(('GET',))
def new_rows(request, timeseries, file, sort, scale, phytoguide):
    
    b = PublicBin.objects.get(timeseries=timeseries, file=file)
    rows = get_rows(b, sort, scale, phytoguide)

    options = {
        'rows': rows
    }

    package = FrontEndPackage(bin={}, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


####### TIME NAVIGATION #######

@api_view(('GET',))
def new_timeseries(request, timeseries_name):
    
    tomorrow = datetime.date.today() + datetime.timedelta(days=1)
    volume_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/' + timeseries_name + '/api/feed/temperature/start/01-01-2015/end/' +  tomorrow.strftime('%Y-%m-%d'))
    volume = volume_response.json()
    recent_file = volume[0]['pid'].split('/')[4][:16]

    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_file(request, timeseries, file, user):
    
    tomorrow = datetime.date.today() + datetime.timedelta(days=1)
    volume_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/' + tomorrow.strftime('%Y-%m-%d'))
    volume = volume_response.json()

    timeline_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/time-series/n_images?resolution=day&dataset=' + timeseries)
    timeline = timeline_response.json()

    present_year = int(timeline['x'][len(timeline['x'])-1][0:4])
    last_year = int(timeline['x'][0][0:4])
    year_options = list(range(int(last_year), int(present_year)+1))

    year = file[1:5]
    day = file[5:7] + '-' + file[7:9]
    filled_days = get_filled_days(timeline)
    file_bin = PublicBin.objects.filter(file=file)
    if not file_bin:
        ifcb = create_public_targets(timeseries, year, day, file)
        file_bin = PublicBin.objects.filter(file=file)
    editor_bin = Classifier.objects.filter(user=user, bins=file_bin[0])
    if not editor_bin:
        user = Classifier.objects.get(user=user)
        targets = PublicTarget.objects.filter(bin=file_bin[0])
        user.targets.add(*targets)    
    
    file_options = get_files(volume, date=year+'-'+day)
    
    num_targets = len(PublicTarget.objects.filter(bin=PublicBin.objects.get(timeseries=timeseries, file=file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = ['All'] + list(range(1, num_sets+1))

    b = PublicBin.objects.get(file=file)
    ifcb = b.ifcb
    rows = get_rows(b, 'AZ', 560, True, 'Public')
    
    bin = {
        'timeseries': timeseries, 
        'ifcb': ifcb,
        'year': year, 
        'day': day, 
        'file': file,
    }
    
    options = {
        'year_options': year_options,
        'day_options': [[], []],
        'file_options': file_options,
        'set_options': set_options,
        'rows': rows,
        'filled_days': filled_days,
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_day(request, timeseries, date):
    
    day = datetime.datetime.strptime(date, '%b%d%Y').strftime('%Y-%m-%d')
    tomorrow = datetime.date.today() + datetime.timedelta(days=1)

    volume_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/' + tomorrow.strftime('%Y-%m-%d'))
    volume = volume_response.json()

    df = pd.DataFrame(volume)
    index = int(df[df['date'].str.contains(day)].index.values[0])
    recent_file = volume[index]['pid'][50:66]
    
    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, set=1, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)
    
    

@api_view(('GET',))
def new_year(request, timeseries, year):
    
    volume_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/31-12-' + year)
    volume = volume_response.json()

    if year == datetime.date.today().strftime('%Y'):
        recent_file = volume[0]['pid'][35:51]
    else:
        recent_file = volume[len(volume)-1]['pid'][35:51]

    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)