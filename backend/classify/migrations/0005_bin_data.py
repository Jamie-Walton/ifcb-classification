# Generated by Django 3.2.4 on 2021-06-30 02:56

from django.db import migrations
import requests


def get_data(apps, schema_editor):
    requests.get()

class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0004_timeseriesoption'),
    ]

    operations = [
    ]
