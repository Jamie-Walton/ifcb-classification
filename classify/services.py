from .models import Bin, ClassOption
import pandas as pd
import requests

def create_targets(bin_url, timeseries, year, day, file):
    
    target_bin_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/' + file + '_' + timeseries)
    target_bin = target_bin_response.json()
    targets = target_bin['targets']
    
    nearest_bin = Bin(timeseries=timeseries, year=year, day=day, file=file, edited=False)
    nearest_bin.save()
    scale = 0.8
    
    classes = None
    maxes = None
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

    for i in range(len(targets)):
        target = targets[i]
        class_name = 'Unclassified'
        class_abbr = 'UNC'
        c = ClassOption.objects.get(autoclass_name=classes[i])
        if maxes[i] >= c.threshold:
            class_name = c.display_name
            class_abbr = c.abbr
        num = '{:0>5}'.format(int(target['targetNumber']))
        width = int(target['width'])
        nearest_bin.target_set.create(number=num, width=width, class_name=class_name, class_abbr=class_abbr, scale=scale)


def get_files(bin_count, bins, timeseries):
    files  = [bins['date'][10:]] + [0]*(bin_count-1)
    for b in range(1, bin_count):
        bins_response = requests.get('http://128.114.25.154:8888/' + timeseries + '/api/feed/after/pid/' + bins['pid'])
        bins = bins_response.json()[0]
        files[b] = bins['date'][10:]
    return files