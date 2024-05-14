from django.urls import path
from . import views

urlpatterns = [
	path(r'incidents/', views.ListCreateIncident.as_view()),
	path(r'incidents/on-map/', views.ListCoordsIncident.as_view()),
	path(r'incidents/<uuid:incident_id>', views.RetrieveDeleteUpdateIncident.as_view())
]