# Generated by Django 3.2.4 on 2022-03-08 04:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_preferences_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='preferences',
            options={'permissions': (('is_lab_user', 'Can Access Lab Classifying'),)},
        ),
    ]
