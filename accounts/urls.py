from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI, PreferencesAPI
from knox import views as knox_views
from accounts import views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/classifier', PreferencesAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('preferences/<str:username>/', views.get_preferences),
    path('preferences/setsort/<str:username>/', views.set_sort),
    path('preferences/setscale/<str:username>/', views.set_scale),
    path('preferences/setload/<str:username>/', views.set_load),
    path('preferences/setphytoguide/<str:username>/', views.set_phytoguide),
    path('labcode/', views.get_labcode),
]