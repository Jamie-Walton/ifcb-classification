# Generated by Django 3.2.4 on 2022-03-24 04:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0056_publictarget_editor'),
    ]

    operations = [
        migrations.CreateModel(
            name='Editor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(default='Autoclassifier', max_length=50)),
            ],
        ),
        migrations.RemoveField(
            model_name='publictarget',
            name='auto',
        ),
        migrations.RemoveField(
            model_name='publictarget',
            name='editor',
        ),
        migrations.AddField(
            model_name='publictarget',
            name='editor',
            field=models.ManyToManyField(blank=True, to='classify.Editor'),
        ),
    ]
