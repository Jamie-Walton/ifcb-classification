import pandas as pd
import requests
from models import ClassOption, TimeSeriesOption

bin_url = 'http://128.114.25.154:8888/IFCB104/D20210714T213454_IFCB104'

target_bin_response = requests.get(bin_url)
target_bin = target_bin_response.json()
targets = sorted(target_bin['targets'], key = lambda i: i['width'],reverse=True)

df = pd.read_csv(bin_url + '_class_scores.csv')
header = list(df.columns.values)
timeseries = 'IFCB104'
timeseries_obj = TimeSeriesOption.objects.get(name=timeseries)
if timeseries == 'IFCB104':
    header = header[0:9] + [header[9] + '/' + header[10] + '/' + header[11]] + \
        header[12:18] + [header[18] + '/' + header[19]] + header[20:]

classes = []

for i in range(1,500):
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
    classes = [class_name] + classes