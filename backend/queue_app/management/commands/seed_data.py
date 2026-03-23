from django.core.management.base import BaseCommand
from queue_app.models import Department

class Command(BaseCommand):
    help = 'Seed initial data for the hospital queue system'
    
    def handle(self, *args, **kwargs):
        departments = [
            {'name': 'General Consultation', 'current_queue': 5, 'avg_wait_time': 15},
            {'name': 'Laboratory', 'current_queue': 3, 'avg_wait_time': 10},
            {'name': 'Pharmacy', 'current_queue': 8, 'avg_wait_time': 8},
            {'name': 'Pediatrics', 'current_queue': 4, 'avg_wait_time': 20},
            {'name': 'Emergency', 'current_queue': 1, 'avg_wait_time': 5},
            {'name': 'Radiology', 'current_queue': 2, 'avg_wait_time': 12},
        ]
        
        for dept_data in departments:
            Department.objects.get_or_create(
                name=dept_data['name'],
                defaults={
                    'current_queue': dept_data['current_queue'],
                    'avg_wait_time': dept_data['avg_wait_time']
                }
            )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded departments data!')
        )
