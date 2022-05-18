from django.contrib import admin
from .models import Preferences, LabCode

class ClassifierAdmin(admin.ModelAdmin):
    list_display = ('user', 'sort', 'scale', 'load')

class LabCodeAdmin(admin.ModelAdmin):
    list_display = ('code',)

admin.site.register(Preferences, ClassifierAdmin)
admin.site.register(LabCode, LabCodeAdmin)