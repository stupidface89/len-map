from functools import lru_cache

from django.core.exceptions import BadRequest
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import (IncidentCreateSerializer, IncidentOnlyCoordsSerializer, IncidentFullDataSerializer,
                          IncidentResponseSerializer)
from .services import IncidentService


class ListCoordsIncident(APIView):

	@lru_cache(maxsize=256)
	def get(self, request):
		get_incidents = IncidentService().list_coords()
		serializer = IncidentOnlyCoordsSerializer(data=get_incidents, many=True)
		serializer.is_valid()
		return JsonResponse(data=serializer.data, status=status.HTTP_200_OK, safe=False)


class RetrieveDeleteUpdateIncident(APIView):

	@lru_cache(maxsize=256)
	def get(self, request, incident_id, *args, **kwargs):
		get_incident = IncidentService().retrieve_instance(incident_id)
		serializer = IncidentFullDataSerializer(instance=get_incident)
		return JsonResponse(data=serializer.data, status=status.HTTP_200_OK, safe=False)


class ListCreateIncident(APIView):

	@lru_cache(maxsize=256)
	def get(self, request, page: int = 0, limit: int = 12):

		try:
			page = int(request.query_params.get('page'))
		except (ValueError, TypeError):
			pass

		status_filter: tuple = tuple(request.query_params.getlist('status'))
		get_incidents: dict = IncidentService().list_instances(status_filters=status_filter, page=page, limit=limit)

		serializer = IncidentResponseSerializer(get_incidents)
		return JsonResponse(data=serializer.data, status=status.HTTP_200_OK, safe=False)

	def post(self, request):
		serializer = IncidentCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		try:
			data: dict = serializer.validated_data
			new_instance = IncidentService().create_instance(data)
		except BadRequest as e:
			return Response(e.__str__(), status=status.HTTP_400_BAD_REQUEST)

		serializer = IncidentFullDataSerializer(instance=new_instance)
		return JsonResponse(data=serializer.data, status=status.HTTP_201_CREATED, safe=False)



