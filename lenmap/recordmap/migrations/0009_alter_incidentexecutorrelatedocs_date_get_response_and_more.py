# Generated by Django 5.0.4 on 2024-05-12 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recordmap', '0008_alter_incident_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidentexecutorrelatedocs',
            name='date_get_response',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='incidentexecutorrelatedocs',
            name='date_send_request',
            field=models.DateField(blank=True, null=True),
        ),
    ]
