from django.db.models.query_utils import Q
from .models import Bin, ClassOption, TimeSeriesOption, Target
import pandas as pd
import requests
import math
import datetime

def create_targets(timeseries, year, day, file):
    
    ifcb = TimeSeriesOption.objects.get(name=timeseries).ifcb
    try:
        target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + ifcb)
    except:
        try:
            if not ifcb == 'IFCB104':
                target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + 'IFCB104')
            else:
                target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + 'IFCB113')
        except:
            if not ifcb == 'IFCB117':
                target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + 'IFCB117')
            else:
                target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + 'IFCB113')

    bin_url = 'http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + ifcb
    target_bin = target_bin_response.json()
    targets = target_bin['targets']
    
    nearest_bin = Bin(timeseries=timeseries, ifcb=ifcb, year=year, day=day, file=file, edited=False)
    nearest_bin.save()
    
    classes = None
    maxes = None
    try:
        for chunk in pd.read_csv(bin_url + '_class_scores.csv', chunksize=500, usecols=lambda x: x not in 'pid', dtype='float32'):
            if timeseries == 'IFCB104':
                header = list(chunk.columns.values)
                chunk.drop('Skeletonema', inplace=True, axis=1)
                chunk.drop('Thalassionema', inplace=True, axis=1)
                chunk.drop('Thalassiosira', inplace=True, axis=1)
                chunk.drop('unclassified', inplace=True, axis=1)
                header = header[0:8] + [header[8] + '_' + header[9] + '_' + header[10]] + \
                    header[11:17] + [header[17] + '_' + header[18]] + header[19:27]
                chunk.columns = header
            chunk_classes = chunk.idxmax(axis='columns')
            chunk_maxes = chunk.max(axis='columns')
            if classes is None:
                classes = chunk_classes
                maxes = chunk_maxes
            else:
                classes = classes.add(chunk_classes, fill_value='')
                maxes = maxes.add(chunk_maxes, fill_value=0)
    except:
        pass

    for i in range(len(targets)):
        target = targets[i]
        class_name = 'Unclassified'
        class_abbr = 'UNC'
        if classes is not None:
            c = ClassOption.objects.get(autoclass_name=classes[i])
            if maxes[i] >= c.threshold:
                class_name = c.display_name
                class_abbr = c.abbr
        num = '{:0>5}'.format(int(target['targetNumber']))
        height = int(target['width'])
        width = int(target['height'])
        editor = "Auto Classifier"
        date = datetime.date(int(year), int(day[0:2]), int(day[3:]))
        nearest_bin.target_set.create(number=num, width=width, height=height, \
            class_name=class_name, class_abbr=class_abbr, editor=editor, date=date)
    
    return ifcb


def get_files(bin_count, bins, timeseries):
    files  = [bins['date'][10:]] + [0]*(bin_count-1)
    for b in range(1, bin_count):
        bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/after/pid/' + bins['pid'])
        bins = bins_response.json()[0]
        files[b] = bins['date'][10:]
    return files

def get_days(volume, year):
    days = [x['day'] for x in volume if year in x['day']]
    gbs = [x['gb'] for x in volume if year in x['day']]
    i = 0
    heights = []
    short_days = []
    for d in pd.date_range(start='1-1-' + year, end='12-31-' + year):
        short_days += [str(d)[5:10]]
        if i < len(days) and d == pd.Timestamp(days[i]):
            heights = heights + [gbs[i]]
            i += 1
        else:
            heights = heights + [0]
    day_options = [heights, short_days]
    return day_options


def get_rows(b, set, sort):

    if sort == 'AZ':
        targets = Target.objects.filter(bin=b).order_by('class_name', '-height')
    elif sort == 'ZA':
        targets = Target.objects.filter(bin=b).order_by('-class_name', '-height')
    elif sort == 'LS':
        targets = Target.objects.filter(bin=b).order_by('-height')
    elif sort == 'SL':
        targets = Target.objects.filter(bin=b).order_by('height')

    if set == math.ceil((len(targets))/500):
        start = 500*(set-1)
        end = len(targets)
    else:
        start = 500*(set-1)
        end = start+500

    rows = [[]]
    space = 70
    row = 0
    for i in range(0,end-start):
        target = targets[start+i]
        if (space - (target.width*0.056) - 1) < 0:
            rows.append([])
            row += 1
            space = 70 - (target.width*0.056)
        else:
            space -= ((target.width*0.056) + 1)
        rows[row].append(i)

    return rows