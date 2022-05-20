from rest_framework import serializers
from .models import Bin, FrontEndPackage, Note, Target, ClassOption, TimeSeriesOption
from .models import PublicBin, PublicTarget, PublicClassification, CommunityFilePackage

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
        fields = ('id', 'display_name', 'autoclass_name', 'class_id', 'abbr', 'in_use', 'timeseries', 'description', 'examples', 'nonexamples')

class TimeSeriesOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesOption
        fields = ('id', 'name', 'display_name', 'ifcb', 'public', 'public_name')

class BinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bin
        fields = ('id', 'timeseries', 'ifcb', 'year', 'day', 'file', 'complete')

class FrontEndPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontEndPackage
        fields = ('id', 'bin', 'options')

class PublicBinSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicBin
        fields = ('id', 'timeseries', 'ifcb', 'year', 'day', 'file')

class PublicTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicTarget
        fields = ('id', 'bin', 'number', 'height', 'width', 'class_name', 'class_abbr', 'class_id', 'date')

class PublicClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicClassification
        fields = ('id', 'target', 'editor', 'class_name', 'class_abbr', 'class_id', 'date')

class CommunityFilePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityFilePackage
        fields = ('id', 'bin', 'classifier') 