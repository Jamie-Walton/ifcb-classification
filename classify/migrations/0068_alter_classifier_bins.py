# Generated by Django 3.2.4 on 2022-05-18 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0067_auto_20220518_1008'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classifier',
            name='bins',
            field=models.ManyToManyField(blank=True, to='classify.PublicBin'),
        ),
    ]
