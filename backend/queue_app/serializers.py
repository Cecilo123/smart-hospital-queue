from rest_framework import serializers
from .models import Department, PatientTicket


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'current_queue', 'avg_wait_time', 'is_active']


class PatientTicketSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source='department.name',
        read_only=True
    )

    class Meta:
        model = PatientTicket
        fields = [
            'id',
            'ticket_number',
            'patient_name',
            'phone_number',
            'department',
            'department_name',
            'position',
            'status',
            'created_at'
        ]
        read_only_fields = ['ticket_number', 'position', 'status']
