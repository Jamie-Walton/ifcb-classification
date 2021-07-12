# Generated by Django 3.2.4 on 2021-06-29 02:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0002_auto_20210628_1655'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timeseries', models.CharField(choices=[('IFCB104', 'IFCB 104'), ('IFCB113', 'IFCB 113'), ('IFCB117', 'IFCB 117'), ('LabData', 'Lab Data'), ('MLML', 'MLML')], max_length=7)),
                ('year', models.CharField(max_length=4)),
                ('day', models.CharField(max_length=10)),
                ('file', models.CharField(max_length=17)),
            ],
        ),
        migrations.CreateModel(
            name='ClassOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]
