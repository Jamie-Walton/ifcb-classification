from django.contrib import admin
from .models import Target, ClassOption, TimeSeriesOption, Bin, Target, Note

class NoteAdmin(admin.ModelAdmin):
    list_display = ('author', 'date', 'entry', 'parent', 'timeseries', 'ifcb', 'file', 'image', 'flag')
    

class TargetAdmin(admin.ModelAdmin):
    list_display = ('bin', 'number', 'class_name', 'class_abbr', 'class_id', 'editor', 'date', 'notes')

class TimeSeriesInline(admin.TabularInline):
    model = ClassOption.timeseries.through

class ClassOptionAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'autoclass_name', 'class_id', 'abbr', 'in_use', 'description', 'examples', 'nonexamples')
    inlines = [TimeSeriesInline]

class TimeSeriesOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ifcb')

class BinAdmin(admin.ModelAdmin):
    list_display = ('timeseries', 'ifcb', 'year', 'day', 'file',)

admin.site.register(Note, NoteAdmin)
admin.site.register(Target, TargetAdmin)
admin.site.register(ClassOption, ClassOptionAdmin)
admin.site.register(TimeSeriesOption, TimeSeriesOptionAdmin)
admin.site.register(Bin, BinAdmin)