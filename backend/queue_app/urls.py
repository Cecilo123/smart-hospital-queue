from django.urls import path
from . import views

urlpatterns = [
    path('departments/', views.DepartmentList.as_view(), name='departments'),
    path('join-queue/', views.JoinQueueView.as_view(), name='join_queue'),
    path('ticket-status/<str:ticket_number>/', views.TicketStatusView.as_view(), name='ticket_status'),
    path('call-next/<int:department_id>/', views.CallNextPatientView.as_view(), name='call_next'),
]
