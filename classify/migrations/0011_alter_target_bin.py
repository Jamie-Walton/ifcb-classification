# Generated by Django 3.2.4 on 2021-07-02 01:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0010_auto_20210630_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='target',
            name='bin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classify.bin'),
        ),
    ]
