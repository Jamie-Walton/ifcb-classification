# Generated by Django 3.2.4 on 2021-07-04 03:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0014_alter_target_bin'),
    ]

    operations = [
        migrations.AddField(
            model_name='target',
            name='width',
            field=models.IntegerField(default=0),
        ),
    ]
