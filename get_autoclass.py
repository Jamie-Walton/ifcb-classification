import pandas as pd
import requests

df = pd.read_csv('http://128.114.25.154:8888/IFCB104/D20210714T213454_IFCB104_class_scores.csv')
print(df.loc[0]['Akashiwo'])