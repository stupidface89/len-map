import typing
import functools

from django.db import transaction
from django.db.models import Q, Count
from django.core.exceptions import BadRequest
from django.shortcuts import get_object_or_404

from .models import Incident, IncidentPhoto, StatusChoices


class BaseService:
	model_class = None

	def retrieve_instance(self, id_object: int):
		get_object = get_object_or_404(self.model_class, id=id_object)
		return get_object

	def list_instances(self, offset: int, filter_params: dict = None, order_by: str = 'date_created', limit: int = 10, **kwargs):
		pass


class IncidentService(BaseService):
	model_class = Incident

	def list_coords(self):
		return self.model_class.objects.values('id', 'status', 'latitude', 'longitude').filter(~Q(status=StatusChoices.NEW))

	@functools.lru_cache(maxsize=256)
	def list_instances(self, page: int, status_filters: tuple = None, limit: int = 12, **kwargs) -> dict:

		incidents: dict = dict()

		query = self.model_class.objects.prefetch_related(
			'photo', 'executor_related'
		).order_by('-date_created').filter(~Q(status=StatusChoices.NEW))

		offset = page * limit
		end_value = page * limit + limit

		# TODO: Переписать запрос через values() и aggregate(Count('id'))
		if status_filters:
			status_filters = set(status_filters).intersection(StatusChoices.values)
			incidents['data'] = query.filter(Q(status__in=status_filters))[offset:end_value]
			incidents['count'] = query.filter(Q(status__in=status_filters)).count()

		else:
			incidents['data'] = query.all()[offset:end_value]
			incidents['count'] = query.count()

		return incidents

	@transaction.atomic
	def create_instance(self, data: dict) -> Incident | typing.NoReturn:
		try:
			photos: list[dict] = data.pop('photo')
		except KeyError:
			raise BadRequest('Небходимо загрузить хотя бы одну фотографию')

		new_incident = self.model_class.objects.create(**data)
		self.__create_photo(new_incident, photos)
		return new_incident

	@staticmethod
	def __create_photo(obj: Incident, data: list[dict]) -> None:

		IncidentPhotoService().create_instance(obj, data)


class IncidentPhotoService(BaseService):
	model_class = IncidentPhoto

	def create_instance(self, obj: Incident, data: list[dict]) -> list[IncidentPhoto]:
		photo_objs = [self.model_class(incident=obj, path=x.get('base64')) for x in data]
		return self.model_class.objects.bulk_create(objs=photo_objs)
