# Generated by Django 3.2.4 on 2021-07-26 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0034_auto_20210725_0023'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='file',
            field=models.CharField(default='D20210513T071619', max_length=17),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='note',
            name='timeseries',
            field=models.CharField(default='IFCB104', max_length=15),
            preserve_default=False,
        ),
    ]
