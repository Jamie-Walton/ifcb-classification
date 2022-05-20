from django.db.models.query_utils import Q
from .models import Bin, ClassOption, TimeSeriesOption, Target, Note, PublicBin, PublicTarget, Classifier
from .serializers import TargetSerializer, PublicTargetSerializer
import pandas as pd
import numpy as np
from PIL import Image
import os
import re
import requests
import json
import datetime
from scipy.io import savemat
from zipfile import ZipFile
from urllib.request import urlopen
from backend.settings import MEDIA_ROOT


def create_targets(timeseries, year, day, file):
    
    ifcb = TimeSeriesOption.objects.get(name=timeseries).ifcb
    try:
        target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + ifcb)
    except:
        try:
            if not ifcb == 'IFCB104':
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB104')
            else:
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB113')
        except:
            if not ifcb == 'IFCB117':
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB117')
            else:
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB113')

    bin_url = 'http://akashiwo.oceandatacenter.ucsc.edu:8000/' + timeseries + '/' + file + '_' + ifcb
    target_bin = target_bin_response.json()
    targets = json.loads(target_bin['coordinates'])
    targets = sorted(targets, key = lambda i: i['pid'])
    
    nearest_bin = Bin(timeseries=timeseries, ifcb=ifcb, year=year, day=day, file=file)
    nearest_bin.save()
    
    classes = None
    maxes = None
    try:
        for chunk in pd.read_csv(bin_url + '_class_scores.csv', chunksize=500, usecols=lambda x: x not in 'pid', dtype='float32'):
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
        num = int(target['pid'])
        height = int(target['height'])*(1/(target_bin['scale']))
        width = int(target['width'])*(1/(target_bin['scale']))
        editor = "Auto Classifier"
        date = datetime.date(int(year), int(day[0:2]), int(day[3:]))
        nearest_bin.target_set.create(number=num, width=width, height=height, \
            class_name=class_name, class_abbr=class_abbr, class_id=class_id, \
            editor=editor, date=date)
    
    return ifcb


def create_public_targets(timeseries, year, day, file):
    
    ifcb = TimeSeriesOption.objects.get(name=timeseries).ifcb
    try:
        target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + ifcb)
    except:
        try:
            if not ifcb == 'IFCB104':
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB104')
            else:
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB113')
        except:
            if not ifcb == 'IFCB117':
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB117')
            else:
                target_bin_response = requests.get('http://akashiwo.oceandatacenter.ucsc.edu:8000/api/bin/' + file + '_' + 'IFCB113')

    bin_url = 'http://akashiwo.oceandatacenter.ucsc.edu:8000/' + timeseries + '/' + file + '_' + ifcb
    target_bin = target_bin_response.json()
    targets = json.loads(target_bin['coordinates'])
    targets = sorted(targets, key = lambda i: i['pid'])
    
    nearest_bin = PublicBin(timeseries=timeseries, ifcb=ifcb, year=year, day=day, file=file)
    nearest_bin.save()
    
    classes = None
    maxes = None
    try:
        for chunk in pd.read_csv(bin_url + '_class_scores.csv', chunksize=500, usecols=lambda x: x not in 'pid', dtype='float32'):
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
        num = int(target['pid'])
        height = int(target['height'])*(1/(target_bin['scale']))
        width = int(target['width'])*(1/(target_bin['scale']))
        date = datetime.date(int(year), int(day[0:2]), int(day[3:]))
        nearest_bin.publictarget_set.create(number=num, width=width, height=height, \
            class_name=class_name, class_abbr=class_abbr, class_id=class_id, \
            date=date)
        
        autoclassifier = Classifier.objects.get(user='Auto Classifier')
        classifier_targets = PublicTarget.objects.filter(bin=nearest_bin)
        autoclassifier.targets.add(*classifier_targets)
    
    return ifcb


def sync_autoclass(timeseries, year, day, file):
    
    # TODO: Fix later
    b = Bin.objects.get(timeseries=timeseries, file=file)
    b.delete()


def get_files(volume, date):
    
    df = pd.DataFrame(volume)
    pids = df.loc[df['date'].str.contains(date)]['pid'].values.tolist()
    files = [pid.split('/')[4][9:12] + ':' + pid.split('/')[4][12:14] + ':' + pid.split('/')[4][14:16] + 'Z' for pid in pids]

    return files

def get_days(timeline, year):
    
    days = [timeline['x'][x][:10] for x in range(0,len(timeline['x'])) if year in timeline['x'][x]]
    num_images = [timeline['y'][x] for x in range(0,len(timeline['y'])) if year in timeline['x'][x]]

    i = 0
    heights = []
    short_days = []
    for d in pd.date_range(start='1-1-' + year, end='12-31-' + year):
        short_days += [str(d)[5:10]]
        if i < len(days) and d == pd.Timestamp(days[i]):
            heights = heights + [num_images[i]]
            i += 1
        else:
            heights = heights + [0]
    day_options = [heights, short_days]
    filled_days =  [day[5:] for day in days]
    return day_options, filled_days


def get_filled_days(timeline):
    
    days = [timeline['x'][x][:10] for x in range(0,len(timeline['x']))]
    return days


def get_rows(b, sort, scale, phytoguide, status='Lab', user=None):

    if status == 'Public':
        targets = PublicTarget.objects.filter(bin=b).filter(classifier__user=user).order_by('class_name', '-height')
        class_name = 'class_name'
    else:
        class_name = 'class_name'
        if sort == 'AZ':
            targets = Target.objects.filter(bin=b).order_by(class_name, '-height')
        elif sort == 'ZA':
            targets = Target.objects.filter(bin=b).order_by(-class_name, '-height')
        elif sort == 'LS':
            targets = Target.objects.filter(bin=b).order_by('-height')
        elif sort == 'SL':
            targets = Target.objects.filter(bin=b).order_by('height')

    rows = [[]]
    space = 70
    initial_space = 70
    if bool(phytoguide):
        space = 55
        initial_space = 55
    row = 0
    for i in range(0,len(targets)):
        target = targets[i]
        if (space - (target.width*(scale/10000)) - 1) < 0:
            rows.append([])
            row += 1
            if target.width*(scale/10000) > initial_space:
                space = initial_space
            else:
                space = initial_space - (target.width*(scale/10000))
        else:
            space -= ((target.width*(scale/10000)) + 1)
        rows[row].append(i)
        #if target.width*(scale/10000) > initial_space:
        #row +=1
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

    displays = ClassOption.objects.values_list('display_name', flat=True).order_by('class_id', 'id')
    names = ClassOption.objects.values_list('autoclass_name', flat=True).order_by('class_id', 'id')
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


def saveCommunityClassifications(b, ifcb, file, user):
    targets = Target.objects.filter(bin=b)
    targets = PublicTarget.objects.filter(bin=b).filter(classifier__user=user)
    serializer = PublicTargetSerializer(targets, many=True)
    drop_categories = ['id', 'bin', 'height', 'width', 'class_abbr', 'class_name', 'date']
    df = pd.DataFrame(serializer.data).drop(drop_categories, axis=1)
    df.number = df.number.astype('double', copy=False)
    df.class_id = df.class_id.astype('double', copy=False)
    df['auto'] = np.NaN

    displays = ClassOption.objects.values_list('display_name', flat=True).order_by('class_id', 'id')
    names = ClassOption.objects.values_list('autoclass_name', flat=True).order_by('class_id', 'id')
    indices = pd.Series(displays).drop_duplicates().index
    classes = pd.Series([names[i] for i in list(range(0,len(names))) if i in indices])

    file_name = MEDIA_ROOT + '/' + file + '_' + ifcb + '_' + user + '.mat'
    path = os.path.join(MEDIA_ROOT, file_name)
    content = {
        'class2use_auto': [],
        'class2use_manual': np.array(classes),
        'classlist': np.array(df),
        'default_class_original': ['unclassified'],
        'list_titles': ['roi number', 'manual', 'auto']
    }
    savemat(path, content)


def create_class_zip(class_name, include, exclude, number):
    targets = Target.objects.filter(class_name=class_name)

    if include != 'None':
        include = include.split('-')
        targets = targets.filter(editor__in=include)
    
    if exclude != 'None':
        exclude = exclude.split('-')
        targets = targets.exclude(editor__in=exclude)

    if number != 'all' and len(targets) > int(number):
        targets = targets[len(targets)-int(number):]
    
    path = os.path.join(MEDIA_ROOT, class_name + '.zip')
    with ZipFile(path, 'w') as zf:
        for target in targets:
            b = target.bin
            url = 'http://akashiwo.oceandatacenter.ucsc.edu:8000/data/' + b.file + '_' + b.ifcb + '_' + b.number + '.jpg'
            image_url = urlopen(url)
            image_name = b.file + '_' + b.ifcb + '_' + target.number + '.jpg'
            zf.writestr(image_name, image_url.read())

    return path


def search_targets(search_terms):
    if (len(search_terms) == 30 or len(search_terms) == 34) and (search_terms.count('_') == 2):
        terms = re.split('_|.jpg', search_terms)
        b = Bin.objects.get(file=terms[0])
        targets = Target.objects.get(bin=b, number=terms[2])
    else:
        terms = search_terms.split(' ')
        targets = Target.objects.all()
        for i in range(len(terms)):
            try:
                number = str(int(terms[i]))
            except:
                number = 0
            targets = targets.filter(Q(number=terms[i]) | Q(number=number) | \
                Q(class_name__icontains=terms[i]) | Q(class_abbr__icontains=terms[i]) | \
                Q(editor__icontains=terms[i]) | Q(bin__file=terms[i]) | \
                Q(notes__entry__icontains=terms[i])
                )
    return targets.order_by('-date')
