from django.http.response import JsonResponse
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.http import HttpResponse, FileResponse
from .serializers import PublicBinSerializer, PublicTargetSerializer, PublicClassificationSerializer, FrontEndPackageSerializer
from .models import PublicBin, PublicTarget, PublicClassification, FrontEndPackage
from .services import create_public_targets, get_files, get_days, get_rows, saveClassifications, sync_autoclass, filter_notes, create_class_zip, search_targets
import requests
import math
import pandas as pd
import numpy as np
from datetime import date
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
def new_targets(request, timeseries, file, sort):
    if request.method == 'GET':
        b = PublicBin.objects.get(timeseries=timeseries, file=file)
        if sort == 'AZ':
            model_targets = PublicTarget.objects.filter(bin=b).order_by('auto_class_name', '-height')
        elif sort == 'ZA':
            model_targets = PublicTarget.objects.filter(bin=b).order_by('-auto_class_name', '-height')
        elif sort == 'LS':
            model_targets = PublicTarget.objects.filter(bin=b).order_by('-height')
        elif sort == 'SL':
            model_targets = PublicTarget.objects.filter(bin=b).order_by('height')

        target_serializer = PublicTargetSerializer(model_targets, many=True)
        return Response(target_serializer.data)


@api_view(('PUT',))
def edit_target(request, timeseries, file, number):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    b = PublicBin.objects.get(timeseries=timeseries, file=file)
    t = PublicTarget.objects.get(bin=b, number=number)
    c = request.data
    if PublicClassification.objects.filter(target=t).exists():
        pass
    else:
        classification = PublicClassification(target=t, editor=c['editor'], class_name=c['class_name'], class_abbr=c['class_abbr'], class_id=c['class_id'], date=c['date'])
        classification.save()

    return Response(status=status.HTTP_204_NO_CONTENT)


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
####### TODO: Fix all of these #######

@api_view(('GET',))
def new_timeseries(request, timeseries_name):
    
    volume_response = requests.get('http://128.114.25.154:8000/' + timeseries_name + '/api/feed/temperature/start/01-01-2015/end/' + date.today().strftime('%Y-%m-%d'))
    volume = volume_response.json()
    recent_file = volume[0]['pid'].split('/')[4][:16]

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
    if not PublicBin.objects.filter(file=file):
        ifcb = create_public_targets(timeseries, year, day, file)
    
    file_options = get_files(volume, date=year+'-'+day)
    
    num_targets = len(PublicTarget.objects.filter(bin=PublicBin.objects.get(timeseries=timeseries, file=file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = ['All'] + list(range(1, num_sets+1))

    b = PublicBin.objects.get(file=file)
    ifcb = b.ifcb
    rows = get_rows(b, sort, scale, phytoguide, 'Public')
    
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
    
    volume_response = requests.get('http://128.114.25.154:8000/' + timeseries + '/api/feed/temperature/start/01-01-2015/end/31-12-' + year)
    volume = volume_response.json()

    if year == date.today().strftime('%Y'):
        recent_file = volume[0]['pid'][35:51]
    else:
        recent_file = volume[len(volume)-1]['pid'][35:51]

    options = {}
    bin = {'file': recent_file}

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)