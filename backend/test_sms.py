#!/usr/bin/env python
"""
Test script for SMS service
Run: python test_sms.py
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'queue_system.settings')
django.setup()

from queue_app.utils.sms_service import SMSService

def test_sms():
    print("🔍 Testing SMS Service...")
    
    # Initialize SMS service
    sms = SMSService()
    
    # Check if configured
    if not sms.client:
        print("❌ Twilio not configured. Check your .env file.")
        print("   Make sure you have:")
        print("   - TWILIO_ACCOUNT_SID")
        print("   - TWILIO_AUTH_TOKEN")
        print("   - TWILIO_PHONE_NUMBER")
        return
    
    print("✅ Twilio client initialized successfully")
    print(f"   From number: {sms.from_number}")
    
    # Ask for phone number to test
    test_number = input("Enter your phone number (with country code, e.g., +254712345678): ")
    
    # Send test SMS
    print(f"\n📱 Sending test SMS to {test_number}...")
    result = sms.send_test_sms(test_number)
    
    if result:
        print("✅ Test SMS sent successfully!")
        print("   Check your phone for the message.")
    else:
        print("❌ Failed to send test SMS.")
        print("   Check your Twilio credentials and trial account limits.")

if __name__ == "__main__":
    test_sms()
