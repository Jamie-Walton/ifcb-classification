# Generated by Django 3.2.4 on 2021-07-05 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0018_frontendpackage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='frontendpackage',
            name='bin',
        ),
        migrations.AddField(
            model_name='frontendpackage',
            name='bin',
            field=models.JSONField(),
        ),
    ]
