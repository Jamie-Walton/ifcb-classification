from django.db import models

class TimeSeriesOption(models.Model):
    name = models.CharField(max_length=15)
    def _str_(self):
        return self.name

class Bin(models.Model):
    timeseries = models.CharField(max_length=15)
    year = models.CharField(max_length=4)
    day = models.CharField(max_length=5) # currently in MM-DD format
    file = models.CharField(max_length=17)

    # TODO: Add whether it has been edited or not later

    def _str_(self):
        return self.file


class Set(models.Model):
    bin = models.ForeignKey(Bin, on_delete=models.CASCADE)
    number = models.IntegerField(default=1)
    scale = models.DecimalField(max_digits=4, decimal_places=2)
    # TODO: Add row spacing later


class Target(models.Model):
    set = models.ForeignKey(Set, on_delete=models.CASCADE)
    number = models.CharField(max_length=5)
    width = models.IntegerField(default=0)
    classification = models.CharField(max_length=120)
    scale = models.DecimalField(max_digits=4, decimal_places=2)
    # TODO: Add who classified Target

    def _str_(self):
        return 'target_' + str(self.number)

class ClassOption(models.Model):
    display_name = models.CharField(max_length=100)
    autoclass_name = models.CharField(max_length=100)
    abbr = models.CharField(max_length=10)
    timeseries = models.ManyToManyField(TimeSeriesOption)

    def _str_(self):
        return self.display_name

class FrontEndPackage(models.Model):
    bin = models.JSONField()
    set = models.JSONField()
    options = models.JSONField()