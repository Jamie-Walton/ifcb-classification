from django.contrib import admin
from .models import Target, ClassOption, TimeSeriesOption, Bin, Set, Target

class TargetAdmin(admin.ModelAdmin):
    list_display = ('set', 'number', 'classification', 'scale')

class ClassOptionAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'autoclass_name', 'abbr')

class TimeSeriesOptionAdmin(admin.ModelAdmin):
    list_display = ('name',)

class BinAdmin(admin.ModelAdmin):
    list_display = ('timeseries','year', 'day', 'file')

class SetAdmin(admin.ModelAdmin):
    list_display = ('bin', 'number', 'scale')

admin.site.register(Target, TargetAdmin)
admin.site.register(ClassOption, ClassOptionAdmin)
admin.site.register(TimeSeriesOption, TimeSeriesOptionAdmin)
admin.site.register(Bin, BinAdmin)
admin.site.register(Set, SetAdmin)