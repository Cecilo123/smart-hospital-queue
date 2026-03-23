from django.contrib import admin
from .models import Department, PatientTicket

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'current_queue', 'avg_wait_time', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(PatientTicket)
class PatientTicketAdmin(admin.ModelAdmin):
    list_display = (
        'ticket_number',
        'patient_name',
        'department',
        'position',
        'status',
        'created_at'
    )
    list_filter = ('status', 'department', 'created_at')
    search_fields = ('ticket_number', 'patient_name', 'phone_number')
    readonly_fields = ('ticket_number', 'created_at')
