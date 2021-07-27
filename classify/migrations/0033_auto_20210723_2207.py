# Generated by Django 3.2.4 on 2021-07-23 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0032_target_height'),
    ]

    operations = [
        migrations.AddField(
            model_name='target',
            name='date',
            field=models.DateField(auto_now=True),
        ),
        migrations.AddField(
            model_name='target',
            name='editor',
            field=models.CharField(default='Auto Classifier', max_length=50),
        ),
        migrations.AddField(
            model_name='target',
            name='notes',
            field=models.CharField(default='', max_length=140),
        ),
    ]