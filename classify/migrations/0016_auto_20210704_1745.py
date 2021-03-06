# Generated by Django 3.2.4 on 2021-07-04 17:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0015_target_width'),
    ]

    operations = [
        migrations.CreateModel(
            name='Set',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(default=1)),
                ('scale', models.IntegerField(default=1)),
                ('bin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classify.bin')),
            ],
        ),
        migrations.AlterField(
            model_name='target',
            name='bin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classify.set'),
        ),
    ]
