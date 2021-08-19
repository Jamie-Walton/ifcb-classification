from django.db.models.query_utils import Q
from .models import Bin, ClassOption, TimeSeriesOption, Target, Note
from .serializers import TargetSerializer
import pandas as pd
import numpy as np
import os
import requests
import math
import datetime
from scipy.io import savemat
from zipfile import ZipFile
import urllib.request
from backend.settings import MEDIA_ROOT


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
    
    nearest_bin = Bin(timeseries=timeseries, ifcb=ifcb, year=year, day=day, file=file)
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
        class_abbr = 'UNCL'
        class_id = 1
        if classes is not None:
            c = ClassOption.objects.get(autoclass_name=classes[i])
            if maxes[i] >= c.threshold:
                class_name = c.display_name
                class_abbr = c.abbr
                class_id = c.class_id
        num = '{:0>5}'.format(int(target['targetNumber']))
        height = int(target['width'])
        width = int(target['height'])
        editor = "Auto Classifier"
        date = datetime.date(int(year), int(day[0:2]), int(day[3:]))
        nearest_bin.target_set.create(number=num, width=width, height=height, \
            class_name=class_name, class_abbr=class_abbr, class_id=class_id, \
            editor=editor, date=date)
    
    return ifcb

def sync_autoclass(timeseries, year, day, file):
    
    b = Bin.objects.get(timeseries=timeseries, file=file)
    targets = Target.objects.filter(bin=b)
    bin_url = 'http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + b.ifcb
    
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
        return 'Unsuccessful'

    for i in range(len(targets)):
        target = targets[i]
        t = Target.objects.get(bin=b, number=target.number)
        class_name = 'Unclassified'
        class_abbr = 'UNCL'
        class_id = 1
        if classes is not None:
            c = ClassOption.objects.get(autoclass_name=classes[i])
            if maxes[i] >= c.threshold:
                class_name = c.display_name
                class_abbr = c.abbr
                class_id = c.class_id
        num = target.number
        height = target.height
        width = target.width
        editor = "Auto Classifier"
        date = datetime.date(int(year), int(day[0:2]), int(day[3:]))
        serializer = TargetSerializer(t, data={'number': num, 'width': width, 'height': height, \
            'class_name': class_name, 'class_abbr': class_abbr, 'class_id': class_id, \
            'editor': editor, 'date': date})
    
    return serializer


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


def get_rows(b, set, sort, scale):

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
        if (space - (target.width*(scale/10000)) - 1) < 0:
            rows.append([])
            row += 1
            space = 70 - (target.width*(scale/10000))
        else:
            space -= ((target.width*(scale/10000)) + 1)
        rows[row].append(i)

    return rows


def filter_notes(filters):

    search = [f["choice"] for f in filters if f["category"] == "search"]
    if len(search) > 0:
        q = Note.objects.filter(Q(entry__icontains=search[0]) | Q(image__icontains=search[0]) | Q(file__icontains=search[0]))
    else:
        q = Note.objects.all().order_by('-date')

    authors = [f["choice"] for f in filters if f["category"] == "author"]
    if len(authors) > 0:
        q = q.filter(author__in=authors)

    files = [f["choice"] for f in filters if f["category"] == "file"]
    if len(files) > 0:
        q = q.filter(file__in=files)

    timeseries = [f["choice"] for f in filters if f["category"] == "timeseries"]
    if len(timeseries) > 0:
        q = q.filter(timeseries__in=timeseries)

    ifcbs = [f["choice"] for f in filters if f["category"] == "ifcb"]
    if len(ifcbs) > 0:
        q = q.filter(ifcb__in=ifcbs)

    types = [f for f in filters if f["category"] == "type"]
    if types == ["Bin Note"]:
        q = q.filter(image="None")
    elif types == ["Target Note"]:
        q = q.exclude(image="None")

    return q
            

def saveClassifications(b, ifcb, file):
    targets = Target.objects.filter(bin=b)
    serializer = TargetSerializer(targets, many=True)
    drop_categories = ['id', 'bin', 'height', 'width', 'class_abbr', 'class_name', 'editor', 'date', 'notes']
    df = pd.DataFrame(serializer.data).drop(drop_categories, axis=1)
    df.number = df.number.astype('double', copy=False)
    df.class_id = df.class_id.astype('double', copy=False)
    df['auto'] = np.NaN

    displays = ClassOption.objects.values_list('display_name', flat=True).order_by('class_id')
    names = ClassOption.objects.values_list('autoclass_name', flat=True).order_by('class_id')
    indices = pd.Series(displays).drop_duplicates().index
    classes = pd.Series([names[i] for i in list(range(0,len(names))) if i in indices])

    file_name = MEDIA_ROOT + '/' + file + '_' + ifcb + '.mat'
    path = os.path.join(MEDIA_ROOT, file_name)
    content = {
        'class2use_auto': [],
        'class2use_manual': np.array(classes),
        'classlist': np.array(df),
        'default_class_original': ['unclassified'],
        'list_titles': ['roi number', 'manual', 'auto']
    }
    savemat(path, content)


def create_class_zip(class_name, onlyManual):
    targets = Target.objects.filter(class_name=class_name)
    if onlyManual:
        targets.exclude(editor='Auto Classifier')
    for target in targets:
        b = target.bin
        image_url = 'http://128.114.25.154:8888/' + b.timeseries + '/' + b.file + '_' + b.ifcb + '_' + target.number + '.jpg'
        url = urllib.request.urlopen(image_url)
        filename = image_url.split('/')[-1]
        zipPath = '/tmp/%s.zip' % filename
        with ZipFile(zipPath, mode='w') as zf:
            zf.writestr(filename, url.read())