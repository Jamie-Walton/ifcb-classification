# Generated by Django 3.2.4 on 2021-08-17 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0041_note_flag'),
    ]

    operations = [
        migrations.AddField(
            model_name='classoption',
            name='class_id',
            field=models.IntegerField(default='1'),
        ),
        migrations.AddField(
            model_name='target',
            name='class_id',
            field=models.IntegerField(default='1'),
        ),
    ]
