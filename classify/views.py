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

class ClassOptionView(generics.ListAPIView):
    serializer_class = ClassOptionSerializer

    def get_queryset(self):
        timeseries = self.request.timeseries
        return ClassOption.objects.filter(timeseries=TimeSeriesOption.objects.get(name=timeseries))

class TimeSeriesOptionView(viewsets.ModelViewSet):
    serializer_class = TimeSeriesOptionSerializer
    queryset = TimeSeriesOption.objects.all()

class BinView(viewsets.ModelViewSet):
    serializer_class = BinSerializer
    queryset = Bin.objects.all()


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
    targets_full = target_bin['targets']
    targets = sorted(targets_full, key = lambda i: i['width'],reverse=True)

    if not Bin.objects.filter(year=year, day=day):
        nearest_bin = Bin(timeseries=timeseries_name, year=year, day=day, file=first_file)
        nearest_bin.save()
        scale = 0.8
        nearest_set = Set(bin=nearest_bin, number=1, scale=scale)
        nearest_set.save()
        df = pd.read_csv(bin_url + '_class_scores.csv')
        header = list(df.columns.values)
        timeseries = TimeSeriesOption.objects.get(name=timeseries_name)
        if timeseries_name == 'IFCB104':
            header = header[0:9] + [header[9] + '/' + header[10] + '/' + header[11]] + \
                header[12:18] + [header[18] + '/' + header[19]] + header[20:]
        for i in range(0,500):
            target = targets[i]
            for option in header[1:]:
                if ClassOption.objects.filter(timeseries=timeseries, autoclass_name=option):
                    c = ClassOption.objects.get(autoclass_name=option)
                    if df.loc[i][option] <= c.threshold:
                        class_name = c.display_name
                        class_abbr = c.abbr
                        break
                else:
                    class_name = 'Unclassified'
                    class_abbr = 'UNC'
            num = '{:0>5}'.format(int(target['targetNumber']))
            width = int(target['width'])
            nearest_set.target_set.create(number=num, width=width, class_name=class_name, class_abbr=class_abbr, scale=scale)
    
    last_year = int(volume[0]['day'][0:4])
    year_options = list(range(last_year, int(year)+1))

    day_options = [day['day'][6:] for day in volume[len(volume)-10:len(volume)-1]]

    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries_name)

    num_targets = len(targets_full)
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))

    options = {
        'year_options': year_options,
        'day_options': day_options,
        'file_options': file_options,
        'set_options': set_options,
    }

    bin = {
        'timeseries': timeseries_name, 
        'year': year, 
        'day': day, 
        'file': first_file,
    }

    set = {'number': 1}

    package = FrontEndPackage(bin=bin, set=set, options=options)
    front_end_package = FrontEndPackageSerializer(package)
    
    return Response(front_end_package.data)


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
        b = Bin.objects.get(file=file)
        
        if not Set.objects.filter(bin=b, number=set):
            bin_url = 'http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + timeseries
            target_bin_response = requests.get(bin_url)
            target_bin = target_bin_response.json()
            targets = sorted(target_bin['targets'], key = lambda i: i['width'],reverse=True)
            target_count = len(targets)
            if set == math.ceil((target_count)/500):
                start = 500*(set-1)
                rng = range(start, len(targets))
            else:
                start = 500*(set-1)
                rng = range(start, start+500)
            
            scale = 0.8
            s = Set(bin=b, number=set, scale=scale)
            s.save()

            df = pd.read_csv(bin_url + '_class_scores.csv')
            header = list(df.columns.values)
            timeseries_obj = TimeSeriesOption.objects.get(name=timeseries)
            if timeseries == 'IFCB104':
                header = header[0:9] + [header[9] + '/' + header[10] + '/' + header[11]] + \
                    header[12:18] + [header[18] + '/' + header[19]] + header[20:]
            for i in rng:
                target = targets[i]
                for option in header[1:]:
                    if ClassOption.objects.filter(timeseries=timeseries_obj, autoclass_name=option):
                        c = ClassOption.objects.get(autoclass_name=option)
                        if df.loc[i][option] <= c.threshold:
                            class_name = c.display_name
                            class_abbr = c.abbr
                            break
                    else:
                        class_name = 'Unclassified'
                        class_abbr = 'UNC'
                num = '{:0>5}'.format(int(target['targetNumber']))
                width = int(target['width'])
                s.target_set.create(number=num, width=width, class_name=class_name, class_abbr=class_abbr, scale=scale)
            
        s = Set.objects.get(bin=b, number=set)
        model_targets = Target.objects.filter(set=s).order_by('-width')
        target_serializer = TargetSerializer(model_targets, many=True)
        return Response(target_serializer.data)
        
    elif request.method == 'PUT':
        serializer = TargetSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(('GET',))
def new_file(request, timeseries, file):
    year = file[1:5]
    day = file[5:7] + '-' + file[7:9]
    if not Bin.objects.filter(file=file):
        b = Bin(timeseries=timeseries, year=year, day=day, file=file)
        b.save()
    
    target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + timeseries)
    target_bin = target_bin_response.json()
    targets_full = target_bin['targets']
    num_targets = len(targets_full)
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))
    
    bin = {
        'timeseries': timeseries, 
        'year': year, 
        'day': day, 
        'file': file,
    }
    
    options = {
        'year_options': 'NA',
        'day_options': 'NA',
        'file_options': 'NA',
        'set_options': set_options,
    }

    package = FrontEndPackage(bin=bin, set=1, options=options)
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
    target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + first_file + '_' + timeseries)
    target_bin = target_bin_response.json()
    targets_full = target_bin['targets']
    targets = sorted(targets_full, key = lambda i: i['width'],reverse=True)

    if not Bin.objects.filter(year=year, day=day):
        nearest_bin = Bin(timeseries=timeseries, year=year, day=day, file=first_file)
        nearest_bin.save()
        max_width = targets[0]['width']
        scale = 0.8
        nearest_set = Set(bin=nearest_bin, number=1, scale=scale)
        nearest_set.save()
        for target in targets[0:200]:
            num = '{:0>5}'.format(int(target['targetNumber']))
            width = int(target['width'])
            nearest_set.target_set.create(number=num, width=width, classification='', scale=scale)
    
    target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + first_file + '_' + timeseries)
    target_bin = target_bin_response.json()
    targets_full = target_bin['targets']
    file_options = get_files(int(volume[len(volume)-1]['bin_count']), bins, timeseries)

    num_targets = len(targets_full)
    num_sets = math.ceil((num_targets)/500)
    set_options = list(range(1, num_sets+1))
    
    bin = {
        'timeseries': timeseries, 
        'year': year, 
        'day': day, 
        'file': first_file,
    }
    
    options = {
        'year_options': 'NA',
        'day_options': 'NA',
        'file_options': file_options,
        'set_options': set_options,
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