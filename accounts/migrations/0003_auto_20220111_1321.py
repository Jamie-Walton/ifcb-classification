# Generated by Django 3.2.4 on 2022-01-11 21:21

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0002_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Classifier',
            new_name='Preferences',
        ),
        migrations.RenameField(
            model_name='preferences',
            old_name='load_preference',
            new_name='load',
        ),
        migrations.RenameField(
            model_name='preferences',
            old_name='scale_preference',
            new_name='scale',
        ),
        migrations.RenameField(
            model_name='preferences',
            old_name='sort_preference',
            new_name='sort',
        ),
    ]
