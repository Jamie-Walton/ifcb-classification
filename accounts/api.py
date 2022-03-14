from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from knox.models import AuthToken
from django.contrib.auth.models import Group
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, PreferencesSerializer

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):

        data = {'username': request.data['username'], 'email': request.data['email'], 'password': request.data['password']}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        group = Group.objects.get(name=request.data['groups'])
        group.user_set.add(user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        group = Group.objects.filter(user=user).exists()

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'group': group,
            'token': AuthToken.objects.create(user)[1]
        })


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user



# Get Preferences API
class PreferencesAPI(generics.RetrieveAPIView):

    serializer_class = PreferencesSerializer

    def get_object(self):
        return self.request.user