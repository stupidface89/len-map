import os.path
import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _


class StatusChoices(models.TextChoices):
	NEW = 'NEW', 'Новое обращение'
	PUBLISHED = 'PUBLISHED', 'Опубликовано'
	SENT = 'SENT', 'Отправлено'
	INWORK = 'INWORK', 'Дан ответ'
	DONE = 'DONE', 'Выполнено'
	FAIL = 'FAIL', 'Не выполнено'


def incident_images_path(instance, filename=None):
	return f'incidents/{instance.incident.id}/{instance.path}'


def request_doc_path(instance, filename=None):
	upload_to = 'docs/requests/'
	if instance.pk:
		name = instance.pk.hex
	else:
		name = uuid.uuid4().hex

	ext = filename.split('.')[-1].lower()
	filename = f'{name}.{ext}'
	return os.path.join(upload_to, filename)


def response_doc_path(instance, filename=None):
	upload_to = 'docs/response/'
	if instance.pk:
		name = instance.pk.hex
	else:
		name = uuid.uuid4().hex

	ext = filename.split('.')[-1].lower()
	filename = f'{name}.{ext}'
	return os.path.join(upload_to, filename)


class IncidentPhoto(models.Model):
	id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
	incident = models.ForeignKey('Incident', help_text=_('Обращение'), related_name='photo', on_delete=models.CASCADE)
	path = models.ImageField(_('Путь до файла'), upload_to=incident_images_path, blank=False, null=False)

	class Meta:
		verbose_name = _('Фото обращения')
		verbose_name_plural = _('Фото обращений')

	def __str__(self):
		return f'Обращение № {self.incident.number}'


class Executor(models.Model):
	id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
	title = models.CharField(_('Наименование'), max_length=100, blank=False, unique=True)
	address = models.TextField(_('Адрес местонахождения'), max_length=350, null=True, blank=True)
	phone = models.CharField(max_length=50, null=True, blank=True)
	email = models.CharField(max_length=50, null=True, blank=True)
	executor_contact = models.CharField(_('Контактное лицо'), max_length=65, null=True)

	def __str__(self):
		return self.title

	class Meta:
		verbose_name = _('Ответственное ведомство/организация')
		verbose_name_plural = _('Ответственные ведомства и организации')


class Incident(models.Model):
	id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
	number = models.IntegerField(_('Номер обращения'), unique=True, blank=False, null=False, editable=False)
	full_name = models.CharField(_('Имя'), max_length=100, null=False, blank=False)
	phone_number = models.CharField(_('Номер телефона'), max_length=50, null=False, blank=False)
	address = models.CharField(_('Адрес проблемы'), max_length=255, null=False, blank=False)
	status = models.CharField(_('Статус обращения'), max_length=25, null=False, blank=False, default=StatusChoices.NEW, choices=StatusChoices.choices)
	date_created = models.DateTimeField(_('Дата создания'), auto_now_add=True, null=False, blank=False)
	date_modified = models.DateTimeField(auto_now=True, null=False, blank=False)
	text = models.TextField(_('Текст обращения'), max_length=350, null=False, blank=False)
	latitude = models.DecimalField(_('Координаты широты'), max_digits=17, decimal_places=14, null=True, blank=False)
	longitude = models.DecimalField(_('Координаты долготы'), max_digits=17, decimal_places=14, null=True, blank=False)

	class Meta:
		verbose_name = _('Обращение')
		verbose_name_plural = _('Обращения')

	def __str__(self):
		return f'Обращение № {str(self.number)}, {self.address}'

	def save(self, *args, **kwargs):
		if not self.number:
			get_last = Incident.objects.order_by('number').last()
			if not get_last:
				self.number = 1
			else:
				self.number = (get_last.number + 1)

		super().save(*args, **kwargs)


class IncidentExecutorRelateDocs(models.Model):
	id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
	incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='executor_related')
	executor = models.ForeignKey(Executor, on_delete=models.CASCADE, related_name='executor_related', blank=True, null=True)
	request_doc = models.FileField(_('Документ запроса'), upload_to=request_doc_path, blank=True, null=True)
	response_doc = models.FileField(_('Документ ответа'), upload_to=response_doc_path, blank=True, null=True)
	date_send_request = models.DateField(_('Дата отправки запроса'), blank=True, null=True)
	date_get_response = models.DateField(_('Дата получения ответа'), blank=True, null=True)

	class Meta:
		verbose_name = _('Обращение')
		verbose_name_plural = _('Обращения')
		models.UniqueConstraint(fields=['incident', 'executor'], name='unique_executor_incident')

	def __str__(self):
		return self.executor.title
