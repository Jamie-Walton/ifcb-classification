from rest_framework import serializers
from .models import Bin, FrontEndPackage, Set, Target, ClassOption, TimeSeriesOption

class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ('id', 'bin', 'number', 'height', 'width', 'class_name', 'class_abbr', 'editor', 'date', 'notes')

class ClassOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassOption
        fields = ('id', 'display_name', 'autoclass_name', 'abbr', 'timeseries')

class TimeSeriesOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesOption
        fields = ('id', 'name', 'ifcb')

class BinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bin
        fields = ('id', 'timeseries', 'ifcb', 'year', 'day', 'file', 'edited')

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ('id', 'bin', 'number', 'scale')

class FrontEndPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontEndPackage
        fields = ('id', 'bin', 'options')