import pandas as pd
import requests

bin_url = 'http://128.114.25.154:8888/IFCB104/D20210716T000923_IFCB104'

# target_bin_response = requests.get(bin_url)
# target_bin = target_bin_response.json()
# targets = sorted(target_bin['targets'], key = lambda i: i['width'],reverse=True)

# df = pd.read_csv(bin_url + '_class_scores.csv', usecols=["Akashiwo"], dtype={"Akashiwo": "float32"})
# maxes = df.idxmax(axis='columns')
# classes = df.idxmax(axis='columns')

classes = None
maxes = None
for chunk in pd.read_csv(bin_url + '_class_scores.csv', chunksize=500, usecols=lambda x: x not in 'pid', dtype='float32'):
    
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

print(classes[0])
print(maxes[0])
