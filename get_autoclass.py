import pandas as pd
import requests

bin_url = 'http://128.114.25.154:8888/IFCB104/D20210714T213454_IFCB104'

# target_bin_response = requests.get(bin_url)
# target_bin = target_bin_response.json()
# targets = sorted(target_bin['targets'], key = lambda i: i['width'],reverse=True)

df = pd.read_csv(bin_url + '_class_scores.csv')
header = list(df.columns.values)
df.drop('Skeletonema', inplace=True, axis=1)
df.drop('Thalassionema', inplace=True, axis=1)
df.drop('Thalassiosira', inplace=True, axis=1)
df.drop('unclassified', inplace=True, axis=1)
header = header[0:9] + [header[9] + '_' + header[10] + '_' + header[11]] + \
    header[12:18] + [header[18] + '_' + header[19]] + header[20:28]
df.columns = header
df.drop('pid', inplace=True, axis=1)
maxes = df.idxmax(axis='columns')