from django.db import models

class TimeSeriesOption(models.Model):
    name = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    def _str_(self):
        return self.name

class Day(models.Model):
    date = models.CharField(max_length=5)
    number = models.CharField(default=0)
    gb = models.DecimalField(default=0.0)
    edited = models.BooleanField(default=False)

class Bin(models.Model):
    timeseries = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    year = models.CharField(max_length=4)
    day_obj = models.ForeignKey(Day, on_delete=models.CASCADE)
    day = models.CharField(max_length=5)
    file = models.CharField(max_length=17)
    edited = models.BooleanField(default=False)

    def _str_(self):
        return self.file


class Set(models.Model):
    bin = models.ForeignKey(Bin, on_delete=models.CASCADE)
    number = models.IntegerField(default=1)
    scale = models.DecimalField(max_digits=4, decimal_places=2)


class Target(models.Model):
    bin = models.ForeignKey(Bin, on_delete=models.CASCADE)
    number = models.CharField(max_length=5)
    width = models.IntegerField(default=0)
    height = models.IntegerField(default=0)
    class_name = models.CharField(max_length=120)
    class_abbr = models.CharField(max_length=10, default="UNC")
    # TODO: Add who classified Target

    def _str_(self):
        return 'target_' + str(self.number)

class ClassOption(models.Model):
    display_name = models.CharField(max_length=100)
    autoclass_name = models.CharField(max_length=100)
    abbr = models.CharField(max_length=10)
    threshold = models.FloatField(default=0.5)
    timeseries = models.ManyToManyField(TimeSeriesOption)

    def _str_(self):
        return self.display_name

class FrontEndPackage(models.Model):
    bin = models.JSONField()
    set = models.JSONField()
    options = models.JSONField()