from django.db import models

class TimeSeriesOption(models.Model):
    name = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    def _str_(self):
        return self.name

class Note(models.Model):
    author = models.CharField(max_length=50)
    date = models.DateTimeField(auto_now=True)
    entry = models.CharField(max_length=220)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    timeseries = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    file = models.CharField(max_length=17)
    image = models.CharField(max_length=5)


class Bin(models.Model):
    timeseries = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    year = models.CharField(max_length=4)
    day = models.CharField(max_length=5)
    file = models.CharField(max_length=17)
    notes = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)

    def _str_(self):
        return self.file


class Target(models.Model):
    bin = models.ForeignKey(Bin, on_delete=models.CASCADE)
    number = models.CharField(max_length=5)
    height = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    class_name = models.CharField(max_length=120)
    class_abbr = models.CharField(max_length=10, default="UNC")
    editor = models.CharField(max_length=50, default="Auto Classifier")
    date = models.DateField(auto_now=True)
    notes = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)

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