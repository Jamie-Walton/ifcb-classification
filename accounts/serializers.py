from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Classifier
from django.contrib.auth import authenticate

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Classifier Serializer
class ClassifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classifier
        fields = ('id', 'user', 'sort_preference', 'scale_preference', 'load_preference')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], \
        validated_data['email'], validated_data['password'])

        return user


# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        else:
            raise serializers.ValidationError('Incorrect Credentials')