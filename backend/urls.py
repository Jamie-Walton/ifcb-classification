from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from classify import views
from django.views.generic import TemplateView
import debug_toolbar

router = routers.DefaultRouter()
router.register(r'timeseries', views.TimeSeriesOptionView, 'timeseries')
router.register(r'bins', views.BinView, 'bin')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('classes/<str:timeseries>/', views.get_classes),
    path('process/timeseries/<str:timeseries_name>/', views.new_timeseries),
    path('process/file/<str:timeseries>/<str:file>/', views.new_file),
    path('process/day/<str:timeseries>/<str:year>/<int:day>/', views.new_day),
    path('process/year/<str:timeseries_name>/year/<str:year>', views.new_year),
    path('process/targets/<str:timeseries>/<str:file>/<int:set>/<int:sort>/', views.new_targets),
    re_path('.*',TemplateView.as_view(template_name='index.html')),
    path('debug/', include(debug_toolbar.urls)),
]