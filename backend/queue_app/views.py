from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Department, PatientTicket
from .serializers import DepartmentSerializer, PatientTicketSerializer
from datetime import datetime

# Helper function to generate ticket number
def generate_ticket_number(department_prefix="GC"):
    """Generate unique ticket number like GC-001, LAB-012"""
    today = datetime.now().date()
    today_tickets = PatientTicket.objects.filter(
        created_at__date=today,
        ticket_number__startswith=department_prefix
    ).count()
    
    number = str(today_tickets + 1).zfill(3)
    return f"{department_prefix}-{number}"

# 1. List all departments
class DepartmentList(generics.ListAPIView):
    queryset = Department.objects.filter(is_active=True)
    serializer_class = DepartmentSerializer

# 2. Create a new ticket (Join Queue)
class JoinQueueView(APIView):
    def post(self, request):
        data = request.data.copy()
        
        try:
            department = Department.objects.get(id=data.get('department'))
        except Department.DoesNotExist:
            return Response(
                {"error": "Department not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        dept_prefix = department.name[:3].upper() if len(department.name) >= 3 else "TKT"
        ticket_number = generate_ticket_number(dept_prefix)
        
        last_ticket = PatientTicket.objects.filter(
            department=department,
            status='waiting'
        ).order_by('-position').first()
        
        position = (last_ticket.position + 1) if last_ticket else 1
        
        ticket_data = {
            'ticket_number': ticket_number,
            'patient_name': data.get('patient_name'),
            'phone_number': data.get('phone_number'),
            'department': department.id,
            'position': position,
            'status': 'waiting'
        }
        
        serializer = PatientTicketSerializer(data=ticket_data)
        if serializer.is_valid():
            serializer.save()
               # Send SMS notification
        from .utils.sms_service import SMSService
        
        sms = SMSService()
        wait_time_minutes = department.avg_wait_time * position
        
        # Send ticket creation SMS
        sms.send_ticket_created(
            phone_number=data.get('phone_number'),
            ticket_number=ticket_number,
            patient_name=data.get('patient_name'),
            position=position,
            wait_time=wait_time_minutes,
            department_name=department.name
        )
        
        # Log SMS status (optional)
        if sms.client:
            print(f"✅ SMS sent to {data.get('phone_number')} for ticket {ticket_number}")
        else:
            print(f"⚠️ SMS not sent - Twilio not configured")     
            department.current_queue = position
            department.save()
            
            return Response({
                "message": "Ticket created successfully",
                "ticket": serializer.data,
                "estimated_wait": department.avg_wait_time * position
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. Check Ticket Status
class TicketStatusView(APIView):
    def get(self, request, ticket_number):
        try:
            ticket = PatientTicket.objects.get(ticket_number=ticket_number)
            serializer = PatientTicketSerializer(ticket)
            
            department = ticket.department
            tickets_ahead = PatientTicket.objects.filter(
                department=department,
                status='waiting',
                position__lt=ticket.position
            ).count()
            
            estimated_wait = tickets_ahead * department.avg_wait_time
            
            return Response({
                "ticket": serializer.data,
                "tickets_ahead": tickets_ahead,
                "estimated_wait_minutes": estimated_wait
            })
            
        except PatientTicket.DoesNotExist:
            return Response(
                {"error": "Ticket not found"},
                status=status.HTTP_404_NOT_FOUND
            )

# 4. Staff: Call next patient
class CallNextPatientView(APIView):
    def post(self, request, department_id):
        try:
            department = Department.objects.get(id=department_id)
            
            next_ticket = PatientTicket.objects.filter(
                department=department,
                status='waiting'
            ).order_by('position').first()
            
            if not next_ticket:
                return Response({
                    "message": "No patients waiting in this department"
                })
            
            next_ticket.status = 'called'
            next_ticket.save()
                        # Send SMS notification that patient is called
            from .utils.sms_service import SMSService
            
            sms = SMSService()
            sms.send_ticket_called(
                phone_number=next_ticket.phone_number,
                ticket_number=next_ticket.ticket_number,
                patient_name=next_ticket.patient_name,
                department_name=department.name,
                counter_number=None  # You can add a counter number field if needed
            )
            waiting_count = PatientTicket.objects.filter(
                department=department,
                status='waiting'
            ).count()
            department.current_queue = waiting_count
            department.save()
            
            serializer = PatientTicketSerializer(next_ticket)
            
            return Response({
                "message": f"Patient {next_ticket.patient_name} called",
                "ticket": serializer.data
            })
            
        except Department.DoesNotExist:
            return Response(
                {"error": "Department not found"},
                status=status.HTTP_404_NOT_FOUND
            )
