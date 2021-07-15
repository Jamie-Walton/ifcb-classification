import pandas as pd
import requests

autoclass_resp = requests.get('http://128.114.25.154:8888/IFCB104/dashboard/http://128.114.25.154:8888/IFCB104/D20210714T213454_IFCB104.csv')
target_bin = autoclass_resp.json()
print('done')