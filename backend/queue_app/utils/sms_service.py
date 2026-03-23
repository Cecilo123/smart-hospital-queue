"""
SMS Notification Service for Smart Hospital Queue
Uses Twilio API to send SMS notifications to patients
"""

from twilio.rest import Client
from django.conf import settings
import os
import logging

# Set up logging
logger = logging.getLogger(__name__)

class SMSService:
    """
    Service class for sending SMS notifications via Twilio
    """
    
    def __init__(self):
        """Initialize Twilio client with credentials from settings"""
        # Get Twilio credentials from Django settings
        self.account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
        self.auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
        self.from_number = getattr(settings, 'TWILIO_PHONE_NUMBER', None)
        
        # Also try environment variables as fallback
        if not self.account_sid:
            self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        if not self.auth_token:
            self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        if not self.from_number:
            self.from_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        # Initialize client if credentials exist
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
            logger.info("Twilio client initialized successfully")
        else:
            self.client = None
            logger.warning("Twilio credentials not configured - SMS disabled")
    
    def send_sms(self, to_number, message_body):
        """
        Send an SMS message
        
        Args:
            to_number: Recipient phone number (E.164 format, e.g., +254712345678)
            message_body: Text message to send
        
        Returns:
            message_sid if successful, None otherwise
        """
        if not self.client:
            logger.error("Twilio client not initialized - check credentials")
            return None
        
        try:
            # Send the message
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            
            logger.info(f"SMS sent successfully to {to_number}, SID: {message.sid}")
            return message.sid
            
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_number}: {str(e)}")
            return None
    
    def send_ticket_created(self, phone_number, ticket_number, patient_name, position, wait_time, department_name):
        """
        Send SMS notification when a ticket is created
        
        Args:
            phone_number: Patient's phone number
            ticket_number: Generated ticket number (e.g., GC-001)
            patient_name: Patient's name
            position: Position in queue
            wait_time: Estimated wait time in minutes
            department_name: Department name
        """
        message = f"""🏥 Smart Hospital Queue

Hello {patient_name},
Your ticket has been created successfully!

📋 Ticket: {ticket_number}
🏢 Department: {department_name}
📍 Position in queue: #{position}
⏱️ Estimated wait time: {wait_time} minutes

We'll notify you when it's your turn.
Thank you for choosing our hospital!"""

        return self.send_sms(phone_number, message)
    
    def send_ticket_called(self, phone_number, ticket_number, patient_name, department_name, counter_number=None):
        """
        Send SMS notification when patient is called to counter
        
        Args:
            phone_number: Patient's phone number
            ticket_number: Ticket number
            patient_name: Patient's name
            department_name: Department name
            counter_number: Counter number (optional)
        """
        counter_info = f" at Counter #{counter_number}" if counter_number else ""
        
        message = f"""🔔 YOUR TURN! 🔔

Smart Hospital Queue Alert

Dear {patient_name},
Your ticket {ticket_number} is now being called{counter_info}.

Department: {department_name}

Please proceed to the counter immediately.
If you miss your turn, you'll need to get a new ticket."""

        return self.send_sms(phone_number, message)
    
    def send_ticket_reminder(self, phone_number, ticket_number, patient_name, position, wait_time):
        """
        Send reminder for patients still waiting
        
        Args:
            phone_number: Patient's phone number
            ticket_number: Ticket number
            patient_name: Patient's name
            position: Current position in queue
            wait_time: Updated wait time
        """
        message = f"""⏳ Queue Update - Smart Hospital

Hi {patient_name},
Your ticket {ticket_number} is still in queue.

Current position: #{position}
Estimated wait: {wait_time} minutes

Please stay nearby. We'll notify you when it's your turn."""

        return self.send_sms(phone_number, message)
    
    def send_appointment_reminder(self, phone_number, patient_name, appointment_date, appointment_time, department_name):
        """
        Send appointment reminder (for future feature)
        
        Args:
            phone_number: Patient's phone number
            patient_name: Patient's name
            appointment_date: Date of appointment
            appointment_time: Time of appointment
            department_name: Department name
        """
        message = f"""📅 Appointment Reminder - Smart Hospital

Dear {patient_name},
This is a reminder of your upcoming appointment:

📆 Date: {appointment_date}
⏰ Time: {appointment_time}
🏢 Department: {department_name}

Please arrive 15 minutes early.
To reschedule, please contact the hospital."""

        return self.send_sms(phone_number, message)
    
    def send_queue_closing_notice(self, phone_number, ticket_number, patient_name, department_name):
        """
        Send notice when department is about to close
        
        Args:
            phone_number: Patient's phone number
            ticket_number: Ticket number
            patient_name: Patient's name
            department_name: Department name
        """
        message = f"""⚠️ Important Notice - Smart Hospital

Dear {patient_name},
The {department_name} department will be closing in 30 minutes.

Your ticket ({ticket_number}) is still in queue.
Please ensure you are still in the waiting area.

If you cannot make it, please visit the reception desk."""

        return self.send_sms(phone_number, message)
    
    def send_test_sms(self, phone_number):
        """
        Send a test SMS to verify configuration
        
        Args:
            phone_number: Phone number to send test to
        
        Returns:
            True if successful, False otherwise
        """
        message = "✅ Smart Hospital Queue SMS service is working correctly!\n\nThis is a test message from your hospital queue system."
        
        result = self.send_sms(phone_number, message)
        return result is not None
