# Generated by Django 3.2.4 on 2021-08-09 23:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0040_alter_note_ifcb'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='flag',
            field=models.BooleanField(default=False),
        ),
    ]
