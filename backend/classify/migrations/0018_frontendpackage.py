# Generated by Django 3.2.4 on 2021-07-05 01:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0017_rename_bin_target_set'),
    ]

    operations = [
        migrations.CreateModel(
            name='FrontEndPackage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('options', models.JSONField()),
                ('bin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classify.bin')),
            ],
        ),
    ]