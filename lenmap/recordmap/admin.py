from django.db import models
from django.contrib import admin
from django.utils.html import format_html
from .models import Incident, Executor, IncidentExecutorRelateDocs, IncidentPhoto


class IncidentPhotoInline(admin.StackedInline):
    model = IncidentPhoto
    extra = 0


class IncidentDocsInline(admin.StackedInline):
    model = IncidentExecutorRelateDocs
    extra = 0


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    readonly_fields = ('number', 'address', 'latitude', 'longitude', 'map_url',)

    list_filter = ('status',)
    search_fields = ('number', 'full_name', 'address')
    list_display = ('number', 'status', 'address', 'date_created',)
    ordering = ('-number',)

    inlines = (IncidentPhotoInline, IncidentDocsInline,)

    def map_url(self, obj):
        url = f'http://192.168.0.52/map/?lat={obj.latitude}&long={obj.longitude}&zoom={16}'
        return format_html(f"<a href='{url}'>Посмотреть на карте</a>")

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).prefetch_related('photo', 'executor_related',)


@admin.register(Executor)
class ExecutorAdmin(admin.ModelAdmin):
    pass


@admin.register(IncidentExecutorRelateDocs)
class IncidentExecutorRelateDocsAdmin(admin.ModelAdmin):
    list_display = ('incident', )
