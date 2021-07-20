from django.http.response import JsonResponse
from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ClassOptionSerializer, FrontEndPackageSerializer, TargetSerializer, TimeSeriesOptionSerializer, BinSerializer, SetSerializer
from .models import ClassOption, FrontEndPackage, TimeSeriesOption, Bin, Set, Target
from .services import create_targets, get_files
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


@api_view(('PUT',))
def edit_target(request):
    serializer = TargetSerializer(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('GET','PUT'))
def new_targets(request, timeseries, file, set):
    if request.method == 'GET':
        b = Bin.objects.get(timeseries=timeseries, file=file)
        model_targets = Target.objects.filter(bin=b).order_by('-class_name', '-width')

        if set == math.ceil((len(model_targets))/500):
            start = 500*(set-1)
            end = len(model_targets)
        else:
            start = 500*(set-1)
            end = start+500

        target_serializer = TargetSerializer(model_targets[start:end], many=True)
        return Response(target_serializer.data)
        
    elif request.method == 'PUT':
        serializer = TargetSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(('GET',))
def new_timeseries(request, timeseries_name):
    # get timeline bars instead of day options
    
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/volume')
    volume = volume_response.json()
    year = volume[len(volume)-1]['day'][0:4]
    day = volume[len(volume)-1]['day'][5:]
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    bin_url = bins['pid']
    first_file = re.split('/|_', bin_url)[4]

    if not Bin.objects.filter(year=year, day=day):
        create_targets(timeseries_name, year, day, first_file)
    
    last_year = int(volume[0]['day'][0:4])
    year_options = list(range(last_year, int(year)+1))
    days = [x['day'] for x in volume if year in x['day']]
    gbs = [x['gb'] for x in volume if year in x['day']]
    i = 0
    day_options = []
    for d in pd.date_range(start='1-1-' + year, end='12-31-' + year):
        if i < len(days) and d == pd.Timestamp(days[i]):
            day_options = day_options + [gbs[i]]
            i += 1
        else:
            day_options = day_options + [0]
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries_name)

    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries_name, file=first_file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    edited = Bin.objects.get(file=first_file).edited

    options = {
        'year_options': year_options,
        'day_options': day_options,
        'file_options': file_options,
        'set_options': set_options
    }

    bin = {
        'timeseries': timeseries_name, 
        'year': year, 
        'day': day, 
        'file': first_file,
        'edited': edited
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_file(request, timeseries, file):
    year = file[1:5]
    day = file[5:7] + '-' + file[7:9]
    if not Bin.objects.filter(file=file):
        create_targets(timeseries, year, day, file)
    
    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))
    edited = Bin.objects.get(file=file).edited
    
    bin = {
        'timeseries': timeseries, 
        'year': year, 
        'day': day, 
        'file': file,
        'edited': edited
    }
    
    options = {
        'year_options': 'NA',
        'day_options': 'NA',
        'file_options': 'NA',
        'set_options': set_options
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


@api_view(('GET',))
def new_day(request, timeseries, year, day):
    
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/volume')
    volume = volume_response.json()
    
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    bin_url = bins['pid']
    first_file = re.split('/|_', bin_url)[4]

    if not Bin.objects.filter(year=year, day=day):
        create_targets(timeseries, year, day, first_file)
    
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries)

    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=first_file)))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    edited = Bin.objects.get(file=first_file).edited
    
    bin = {
        'timeseries': timeseries, 
        'year': year, 
        'day': day, 
        'file': first_file,
        'edited': edited,
    }
    
    options = {
        'year_options': 'NA',
        'day_options': 'NA',
        'file_options': file_options,
        'set_options': set_options
    }

    package = FrontEndPackage(bin=bin, set=1, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)
    
    

@api_view(('GET',))
def new_year(request, timeseries, year):
    # get timeline bars instead of day options
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/volume')
    volume = volume_response.json()
    day_options = [day['day'][6:] for day in volume[len(volume)-10:len(volume)-1]]

    day = day_options[len(day_options)]
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries)
    num_targets = len(Target.objects.filter(bin=Bin.objects.get(timeseries=timeseries, file=file_options[0])))
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    if not Bin.objects.filter(year=year, day=day):
        create_targets(timeseries, year, day, file_options[0])

    edited = Bin.objects.get(file=file_options[0]).edited

    options = {
        'year_options': 'NA',
        'day_options': day_options,
        'file_options': file_options,
        'set_options': set_options
    }

    bin = {
        'timeseries': timeseries, 
        'year': year, 
        'day': day, 
        'file': file_options[0],
        'edited': edited
    }

    package = FrontEndPackage(bin=bin, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)