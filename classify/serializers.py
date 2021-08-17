from rest_framework import serializers
from .models import Bin, FrontEndPackage, Note, Target, ClassOption, TimeSeriesOption
import datetime

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'author', 'date', 'entry', 'parent', 'replies', 'timeseries', 'ifcb', 'file', 'image', 'flag')
    
    def get_fields(self):
        fields = super(NoteSerializer, self).get_fields()
        fields['replies'] = NoteSerializer(many=True, read_only=True)
        return fields

class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ('id', 'bin', 'number', 'height', 'width', 'class_name', 'class_abbr', 'class_id', 'editor', 'date', 'notes')

class ClassOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassOption
        fields = ('id', 'display_name', 'autoclass_name', 'class_id', 'abbr', 'in_use', 'timeseries')

class TimeSeriesOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesOption
        fields = ('id', 'name', 'ifcb')

class BinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bin
        fields = ('id', 'timeseries', 'ifcb', 'year', 'day', 'file')

class FrontEndPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontEndPackage
        fields = ('id', 'bin', 'options')