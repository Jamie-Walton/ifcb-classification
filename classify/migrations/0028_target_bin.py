# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0027_bin_edited'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='target',
            name='set',
        ),
        migrations.AddField(
            model_name='target',
            name='bin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classify.bin'),
        ),
    ]
