from rest_framework import serializers
from .models import Bin, FrontEndPackage, Set, Target, ClassOption, TimeSeriesOption

class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ('id', 'set', 'number', 'width', 'classification', 'scale')

class ClassOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassOption
        fields = ('id', 'display_name', 'autoclass_name', 'abbr')

class TimeSeriesOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesOption
        fields = ('id', 'name',)

class BinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bin
        fields = ('id', 'timeseries', 'year', 'day', 'file')

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ('id', 'bin', 'number', 'scale')

class FrontEndPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontEndPackage
        fields = ('id', 'bin', 'set', 'options')