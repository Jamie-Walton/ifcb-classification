# Generated by Django 3.2.4 on 2022-05-18 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classify', '0068_alter_classifier_bins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classifier',
            name='bins_categorized',
            field=models.ManyToManyField(blank=True, related_name='category_classifiers', to='classify.PublicBin'),
        ),
        migrations.AlterField(
            model_name='classifier',
            name='bins_identified',
            field=models.ManyToManyField(blank=True, related_name='identification_classifiers', to='classify.PublicBin'),
        ),
    ]
