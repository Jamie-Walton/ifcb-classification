from django.contrib import admin
from .models import Target, ClassOption, TimeSeriesOption, Bin, Target, Note, PublicTarget, PublicBin, Classifier

class NoteAdmin(admin.ModelAdmin):
    list_display = ('author', 'date', 'entry', 'parent', 'timeseries', 'ifcb', 'file', 'image', 'flag')
    

class TargetAdmin(admin.ModelAdmin):
    list_display = ('bin', 'number', 'class_name', 'class_abbr', 'class_id', 'editor', 'date', 'notes')

class PublicTargetAdmin(admin.ModelAdmin):
    list_display = ('bin', 'number', 'class_name', 'class_abbr', 'class_id', 'date')

class TimeSeriesInline(admin.TabularInline):
    model = ClassOption.timeseries.through

class ClassOptionAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'autoclass_name', 'class_id', 'abbr', 'in_use', 'description', 'examples', 'nonexamples')
    inlines = [TimeSeriesInline]

class TimeSeriesOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ifcb')

class BinAdmin(admin.ModelAdmin):
    list_display = ('timeseries', 'ifcb', 'year', 'day', 'file', 'notes', 'complete')

class PublicBinAdmin(admin.ModelAdmin):
    list_display = ('timeseries', 'ifcb', 'year', 'day', 'file',)

class ClassifierAdmin(admin.ModelAdmin):
    list_display = ('user',)

admin.site.register(Note, NoteAdmin)
admin.site.register(Target, TargetAdmin)
admin.site.register(PublicTarget, PublicTargetAdmin)
admin.site.register(ClassOption, ClassOptionAdmin)
admin.site.register(TimeSeriesOption, TimeSeriesOptionAdmin)
admin.site.register(Bin, BinAdmin)
admin.site.register(PublicBin, PublicBinAdmin)
admin.site.register(Classifier, ClassifierAdmin)