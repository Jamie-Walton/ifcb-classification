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
    path('', include('accounts.urls')),
    path('classes/<str:timeseries>/', views.get_classes),
    path('process/timeseries/<str:timeseries_name>/<str:sort>/', views.new_timeseries),
    path('process/file/<str:timeseries>/<str:file>/<str:sort>/', views.new_file),
    path('process/day/<str:timeseries>/<str:year>/<int:day>/<str:sort>/', views.new_day),
    path('process/year/<str:timeseries>/<str:year>/<str:sort>/', views.new_year),
    path('process/rows/<str:timeseries>/<str:file>/<int:set>/<str:sort>/', views.new_rows),
    path('process/targets/<str:timeseries>/<str:file>/<int:set>/<str:sort>/', views.new_targets),
    path('process/note/<str:timeseries>/<str:file>/<str:image>/', views.get_notes),
    path('save/<str:timeseries>/<str:file>/<int:set>/<str:sort>/', views.save),
    path('sync/<str:timeseries>/<str:year>/<str:day>/<str:file>/', views.sync),
    path('edit/target/<str:timeseries>/<str:file>/<str:number>/', views.edit_target),
    path('edit/targetrow/<str:timeseries>/<str:file>/<str:sort>/<int:startInd>/<int:endInd>/', views.edit_targetrow),
    path('edit/all/<str:timeseries>/<str:file>/<int:set>/<str:sort>/<str:className>/<str:classAbbr>/', views.edit_all),
    path('add/note/', views.add_note),
    path('delete/note/<int:id>/', views.delete_note),
    path('notebook/', views.get_notebook),
    re_path('.*',TemplateView.as_view(template_name='index.html')),
    path('debug/', include(debug_toolbar.urls)),
]