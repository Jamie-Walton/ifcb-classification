from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import PreferencesSerializer
from django.contrib.auth.models import User
from .models import Preferences

@api_view(('GET',))
def get_preferences(request, username):
    user = User.objects.get(username=username)
    preferences = Preferences.objects.get(user=user)
    serializer = PreferencesSerializer(preferences)

    return Response(serializer.data)


@api_view(('POST',))
def set_sort(request, username):
    user = User.objects.get(username=username)
    preferences = Preferences.objects.get(user=user)
    preferences.sort = request.data
    preferences.save()

    return Response(status=status.HTTP_201_CREATED)


@api_view(('POST',))
def set_scale(request, username):
    user = User.objects.get(username=username)
    preferences = Preferences.objects.get(user=user)
    preferences.scale = request.data
    preferences.save()

    return Response(status=status.HTTP_201_CREATED)

@api_view(('POST',))
def set_load(request, username):
    user = User.objects.get(username=username)
    preferences = Preferences.objects.get(user=user)
    preferences.load = request.data
    preferences.save()

    return Response(status=status.HTTP_201_CREATED)


@api_view(('POST',))
def set_phytoguide(request, username):
    user = User.objects.get(username=username)
    preferences = Preferences.objects.get(user=user)
    preferences.phytoguide = request.data
    preferences.save()

    return Response(status=status.HTTP_201_CREATED)
