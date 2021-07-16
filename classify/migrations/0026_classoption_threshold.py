# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0025_classoption_timeseries'),
    ]

    operations = [
        migrations.AddField(
            model_name='classoption',
            name='threshold',
            field=models.FloatField(default=0.5),
        ),
        migrations.RenameField(
            model_name='target',
            old_name='classification',
            new_name='class_name',
        ),
        migrations.AddField(
            model_name='target',
            name='class_abbr',
            field=models.CharField(max_length=10),
        ),
    ]
