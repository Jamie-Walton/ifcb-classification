from django.contrib import admin
from .models import Classifier

class ClassifierAdmin(admin.ModelAdmin):
    list_display = ('user', 'sort_preference', 'scale_preference', 'load_preference')

admin.site.register(Classifier, ClassifierAdmin)