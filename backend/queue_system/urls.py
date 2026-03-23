from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_home(request):
    return JsonResponse({
        "message": "Smart Hospital Queue API",
        "status": "active"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('queue_app.urls')),
    path('', api_home),  # This shows JSON instead of Django welcome
]