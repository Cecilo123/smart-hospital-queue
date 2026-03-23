from django.db import models

# Department model (e.g., General Consultation, Laboratory, Pharmacy)
class Department(models.Model):
    name = models.CharField(max_length=100)
    current_queue = models.IntegerField(default=0)
    avg_wait_time = models.IntegerField(default=15)  # minutes
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

# Patient Ticket model
class PatientTicket(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('called', 'Called to Counter'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    ticket_number = models.CharField(max_length=20, unique=True)
    patient_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    position = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.ticket_number} - {self.patient_name}"
