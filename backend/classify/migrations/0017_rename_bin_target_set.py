# Generated by Django 3.2.4 on 2021-07-04 21:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0016_auto_20210704_1745'),
    ]

    operations = [
        migrations.RenameField(
            model_name='target',
            old_name='bin',
            new_name='set',
        ),
    ]
