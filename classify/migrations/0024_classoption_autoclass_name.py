# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0023_classoption_abbr'),
    ]

    operations = [
        migrations.AddField(
            model_name='classoption',
            name='autoclass_name',
            field=models.CharField(default='placeholder', max_length=100),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='classoption',
            name='name',
        ),
        migrations.AddField(
            model_name='classoption',
            name='display_name',
            field=models.CharField(default='placeholder', max_length=100),
            preserve_default=False,
        ),
    ]
