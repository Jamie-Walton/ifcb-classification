# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0026_classoption_threshold'),
    ]

    operations = [
        migrations.AddField(
            model_name='bin',
            name='edited',
            field=models.BooleanField(default=False),
        ),
    ]
