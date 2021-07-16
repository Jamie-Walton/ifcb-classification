# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0024_classoption_autoclass_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='classoption',
            name='timeseries',
            field=models.ManyToManyField(to='classify.TimeSeriesOption'),
        ),
    ]
