# Generated by Django 3.2.4 on 2021-07-28 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0036_alter_note_parent'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='image',
            field=models.CharField(default='None', max_length=5),
        ),
    ]
