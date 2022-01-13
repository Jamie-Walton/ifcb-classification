from django.contrib import admin
from .models import Preferences

class ClassifierAdmin(admin.ModelAdmin):
    list_display = ('user', 'sort', 'scale', 'load')

admin.site.register(Preferences, ClassifierAdmin)