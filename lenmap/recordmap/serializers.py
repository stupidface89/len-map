import decimal
import base64
import secrets
import typing
from mimetypes import guess_extension

from django.core.files.base import ContentFile
from rest_framework import serializers

from .models import Incident, Executor, IncidentPhoto, IncidentExecutorRelateDocs


class Base64FieldMixin(serializers.ImageField):
	def _decode(self, data):
		if isinstance(data, str) and data.startswith('data:'):
			ext, datastr = data.split(';base64,')
			ext = guess_extension(ext.split(':')[-1])

			data = ContentFile(
				base64.b64decode(datastr), name='{}{}'.format(secrets.token_hex(16), ext)
			)

		elif isinstance(data, str) and data.startswith('http'):
			raise serializers.SkipField()

		return data

	@typing.override
	def to_internal_value(self, data):
		data = self._decode(data)
		return super(Base64FieldMixin, self).to_internal_value(data)


class Base64ImageField(Base64FieldMixin):
	pass


class ExecutorSerializer(serializers.ModelSerializer):

	class Meta:
		model = Executor
		fields = ('title', 'phone', 'executor_contact')


class IncidentExecutorDocSerializer(serializers.ModelSerializer):
	executor = ExecutorSerializer()

	class Meta:
		model = IncidentExecutorRelateDocs
		fields = ('response_doc', 'request_doc', 'date_send_request', 'date_get_response', 'executor')


class IncidentOnlyCoordsSerializer(serializers.ModelSerializer):

	class Meta:
		model = Incident
		fields = ('id', 'status', 'latitude', 'longitude',)


class IncidentPhotoSerializer(serializers.ModelSerializer):
	path = serializers.CharField()

	class Meta:
		model = IncidentPhoto
		fields = ('path',)


class IncidentFullDataSerializer(serializers.ModelSerializer):
	photo = IncidentPhotoSerializer(many=True)
	executor = IncidentExecutorDocSerializer(many=True, source='executor_related')

	class Meta:
		model = Incident
		fields = ('id', 'number', 'address', 'status', 'text', 'date_created', 'latitude', 'longitude', 'photo', 'executor')


class IncidentResponseSerializer(serializers.Serializer):
	data = IncidentFullDataSerializer(many=True)
	count = serializers.IntegerField(required=False)


class IncidentPhotoCreateSerializer(serializers.Serializer):
	base64 = Base64ImageField(required=True)
	size = serializers.IntegerField()


class IncidentCreateSerializer(serializers.Serializer):
	text = serializers.CharField(max_length=350, required=True, min_length=5)
	address = serializers.CharField(max_length=255, required=True, min_length=5)
	full_name = serializers.CharField(max_length=100, required=True, min_length=5)
	phone_number = serializers.CharField(max_length=100, required=True, min_length=10, allow_blank=False)
	latitude = serializers.DecimalField(max_digits=23, decimal_places=20, min_value=decimal.Decimal(54),
	                                    max_value=decimal.Decimal(95), required=True)
	longitude = serializers.DecimalField(max_digits=23, decimal_places=20, min_value=decimal.Decimal(54),
	                                     max_value=decimal.Decimal(95), required=True)

	photo = serializers.ListSerializer(child=IncidentPhotoCreateSerializer(), min_length=1, max_length=4, required=True)



