from django.db import models
from django.contrib.auth.models import User

class TimeSeriesOption(models.Model):
    name = models.CharField(max_length=15)
    display_name = models.CharField(max_length=30, blank=True)
    ifcb = models.CharField(max_length=15)
    public = models.BooleanField(default=True)
    public_name = models.CharField(max_length=30, blank=True)
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
    flag = models.BooleanField(default=False)


class Bin(models.Model):
    timeseries = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    year = models.CharField(max_length=4)
    day = models.CharField(max_length=5)
    file = models.CharField(max_length=17)
    notes = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)
    complete = models.BooleanField(default=False)
    completion_marker = models.CharField(max_length=50, blank=True, null=True)

    def _str_(self):
        return self.file


class Target(models.Model):
    bin = models.ForeignKey(Bin, on_delete=models.CASCADE)
    number = models.CharField(max_length=5)
    height = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    class_name = models.CharField(max_length=120)
    class_abbr = models.CharField(max_length=10, default="UNCL")
    class_id = models.IntegerField(default="1")
    editor = models.CharField(max_length=50, default="Auto Classifier")
    date = models.DateField(auto_now=True)
    notes = models.ForeignKey(Note, on_delete=models.CASCADE, null=True)

    def _str_(self):
        return 'target_' + str(self.number)

class ClassOption(models.Model):
    display_name = models.CharField(max_length=100)
    autoclass_name = models.CharField(max_length=100)
    class_id = models.IntegerField(default="1")
    abbr = models.CharField(max_length=10)
    threshold = models.FloatField(default=0.5)
    in_use = models.BooleanField(default=True)
    timeseries = models.ManyToManyField(TimeSeriesOption)
    description = models.TextField(max_length=300, blank=True)
    examples = models.TextField(max_length=1000, blank=True)
    nonexamples = models.TextField(max_length=1000, blank=True)

    def _str_(self):
        return self.display_name

class FrontEndPackage(models.Model):
    bin = models.JSONField()
    options = models.JSONField()


class PublicBin(models.Model):
    timeseries = models.CharField(max_length=15)
    ifcb = models.CharField(max_length=15)
    year = models.CharField(max_length=4)
    day = models.CharField(max_length=5)
    file = models.CharField(max_length=17)

    def _str_(self):
        return self.file


class PublicTarget(models.Model):
    bin = models.ForeignKey(PublicBin, on_delete=models.CASCADE)
    number = models.CharField(max_length=5)
    height = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    class_name = models.CharField(max_length=120, default='Unclassified')
    class_abbr = models.CharField(max_length=10, default="UNCL")
    class_id = models.IntegerField(default="1")
    date = models.DateField(auto_now=True)

    def _str_(self):
        return 'target_' + str(self.number)

    
class Classifier(models.Model):
    user = models.CharField(max_length=50, default='Autoclassifier')
    user_model = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    targets = models.ManyToManyField(PublicTarget, blank=True)
    bins = models.ManyToManyField(PublicBin, blank=True)
    bins_categorized = models.ManyToManyField(PublicBin, blank=True, related_name='category_classifiers')
    bins_identified = models.ManyToManyField(PublicBin, blank=True, related_name='identification_classifiers')

    def _str_(self):
        return self.user


class PublicClassification(models.Model):
    target = models.ForeignKey(PublicTarget, on_delete=models.CASCADE)
    editor = models.CharField(max_length=50)
    class_name = models.CharField(max_length=120)
    class_abbr = models.CharField(max_length=10)
    class_id = models.IntegerField()
    date = models.DateField(auto_now=True)

class CommunityFilePackage(models.Model):
    bin = models.JSONField()
    classifier = models.CharField(max_length=100)