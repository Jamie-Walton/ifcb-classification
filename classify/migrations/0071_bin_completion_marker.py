# Generated by Django 3.2.4 on 2022-05-27 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0070_bin_complete'),
    ]

    operations = [
        migrations.AddField(
            model_name='bin',
            name='completion_marker',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
