# Generated by Django 3.2.4 on 2022-05-20 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0069_auto_20220518_1027'),
    ]

    operations = [
        migrations.AddField(
            model_name='bin',
            name='complete',
            field=models.BooleanField(default=False),
        ),
    ]