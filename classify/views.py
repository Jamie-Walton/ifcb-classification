from django.http.response import JsonResponse
from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ClassOptionSerializer, FrontEndPackageSerializer, TargetSerializer, TimeSeriesOptionSerializer, BinSerializer, SetSerializer
from .models import ClassOption, FrontEndPackage, TimeSeriesOption, Bin, Set, Target
import requests
import math
import pandas as pd

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
def new_targets(request, timeseries, file):
    if request.method == 'GET':
        b = Bin.objects.get(file=file)
        model_targets = Target.objects.filter(bin=b).order_by('-width')
        target_serializer = TargetSerializer(model_targets, many=True)
        return Response(target_serializer.data)
        
    elif request.method == 'PUT':
        serializer = TargetSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(('GET',))
def new_timeseries(request, timeseries_name):
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/volume')
    volume = volume_response.json()
    year = volume[len(volume)-1]['day'][0:4]
    day = volume[len(volume)-1]['day'][5:]
    bins_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/feed/nearest/' + year + '-' + day)
    bins = bins_response.json()
    bin_url = bins['pid']
    first_file = bin_url[35:51]
    target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/' + first_file + '_' + timeseries_name)
    target_bin = target_bin_response.json()
    targets = target_bin['targets']

    if not Bin.objects.filter(year=year, day=day):
        nearest_bin = Bin(timeseries=timeseries_name, year=year, day=day, file=first_file, edited=False)
        nearest_bin.save()
        scale = 0.8
        df = pd.read_csv(bin_url + '_class_scores.csv')
        header = list(df.columns.values)
        timeseries = TimeSeriesOption.objects.get(name=timeseries_name)
        if timeseries_name == 'IFCB104':
            df.drop('Skeletonema', inplace=True, axis=1)
            df.drop('Thalassionema', inplace=True, axis=1)
            df.drop('Thalassiosira', inplace=True, axis=1)
            df.drop('unclassified', inplace=True, axis=1)
            header = header[0:9] + [header[9] + '_' + header[10] + '_' + header[11]] + \
                header[12:18] + [header[18] + '_' + header[19]] + header[20:28]
            df.columns = header
        for i in range(0,len(targets)):
            target = targets[i]
            class_name = 'Unclassified'
            class_abbr = 'UNC'
            for option in header[1:]:
                if ClassOption.objects.filter(timeseries=timeseries, autoclass_name=option):
                    c = ClassOption.objects.get(autoclass_name=option)
                    if df.loc[i][option] >= c.threshold:
                        class_name = c.display_name
                        class_abbr = c.abbr
                        break
            num = '{:0>5}'.format(int(target['targetNumber']))
            width = int(target['width'])
            nearest_bin.target_bin.create(number=num, width=width, class_name=class_name, class_abbr=class_abbr, scale=scale)
    
    last_year = int(volume[0]['day'][0:4])
    year_options = list(range(last_year, int(year)+1))

    day_options = [day['day'][6:] for day in volume[len(volume)-10:len(volume)-1]]

    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries_name)

    edited = Bin.objects.get(file=first_file).edited

    options = {
        'year_options': year_options,
        'day_options': day_options,
        'file_options': file_options,
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
        nearest_bin = Bin(timeseries=timeseries, year=year, day=day, file=file, edited=False)
        nearest_bin.save()

        bin_url = 'http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + timeseries
        target_bin_response = requests.get(bin_url)
        target_bin = target_bin_response.json()
        targets = target_bin['targets']

        scale = 0.8
        df = pd.read_csv(bin_url + '_class_scores.csv')
        header = list(df.columns.values)
        timeseries = TimeSeriesOption.objects.get(name=timeseries)
        if timeseries == 'IFCB104':
            df.drop('Skeletonema', inplace=True, axis=1)
            df.drop('Thalassionema', inplace=True, axis=1)
            df.drop('Thalassiosira', inplace=True, axis=1)
            df.drop('unclassified', inplace=True, axis=1)
            header = header[0:9] + [header[9] + '_' + header[10] + '_' + header[11]] + \
                header[12:18] + [header[18] + '_' + header[19]] + header[20:28]
            df.columns = header
        for i in range(0,len(targets)):
            target = targets[i]
            class_name = 'Unclassified'
            class_abbr = 'UNC'
            for option in header[1:]:
                if ClassOption.objects.filter(timeseries=timeseries, autoclass_name=option):
                    c = ClassOption.objects.get(autoclass_name=option)
                    if df.loc[i][option] >= c.threshold:
                        class_name = c.display_name
                        class_abbr = c.abbr
                        break
            num = '{:0>5}'.format(int(target['targetNumber']))
            width = int(target['width'])
            nearest_bin.target_bin.create(number=num, width=width, class_name=class_name, class_abbr=class_abbr, scale=scale)
    
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
    first_file = bin_url[35:51]

    if not Bin.objects.filter(year=year, day=day):
        nearest_bin = Bin(timeseries=timeseries, year=year, day=day, file=first_file, edited=False)
        nearest_bin.save()

        bin_url = 'http://128.114.25.154:8888/' + timeseries + '/' + first_file + '_' + timeseries
        target_bin_response = requests.get(bin_url)
        target_bin = target_bin_response.json()
        targets = target_bin['targets']

        scale = 0.8
        df = pd.read_csv(bin_url + '_class_scores.csv')
        header = list(df.columns.values)
        timeseries = TimeSeriesOption.objects.get(name=timeseries)
        if timeseries == 'IFCB104':
            df.drop('Skeletonema', inplace=True, axis=1)
            df.drop('Thalassionema', inplace=True, axis=1)
            df.drop('Thalassiosira', inplace=True, axis=1)
            df.drop('unclassified', inplace=True, axis=1)
            header = header[0:9] + [header[9] + '_' + header[10] + '_' + header[11]] + \
                header[12:18] + [header[18] + '_' + header[19]] + header[20:28]
            df.columns = header
        for i in range(0,len(targets)):
            target = targets[i]
            class_name = 'Unclassified'
            class_abbr = 'UNC'
            for option in header[1:]:
                if ClassOption.objects.filter(timeseries=timeseries, autoclass_name=option):
                    c = ClassOption.objects.get(autoclass_name=option)
                    if df.loc[i][option] >= c.threshold:
                        class_name = c.display_name
                        class_abbr = c.abbr
                        break
            num = '{:0>5}'.format(int(target['targetNumber']))
            width = int(target['width'])
            nearest_bin.target_bin.create(number=num, width=width, class_name=class_name, class_abbr=class_abbr, scale=scale)
    
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries)

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
    }

    package = FrontEndPackage(bin=bin, set=1, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)
    
    

@api_view(('GET',))
def new_year(request, timeseries_name):
    volume_response = requests.get('http://128.114.25.154:8888/' + timeseries_name + '/api/volume')
    volume = volume_response.json()
    first_year = int(volume[len(volume)-1]['day'][0:4])
    last_year = int(volume[0]['day'][0:4])
    year_options = list(range(first_year, last_year+1))
    return year_options


def get_files(bin_count, bins, timeseries):
    files  = [bins['date'][10:]] + [0]*(bin_count-1)
    for b in range(1, bin_count):
        bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/after/pid/' + bins['pid'])
        bins = bins_response.json()[0]
        files[b] = bins['date'][10:]
    return files