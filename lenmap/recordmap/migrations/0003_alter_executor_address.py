# Generated by Django 5.0.4 on 2024-05-05 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recordmap', '0002_alter_executor_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='executor',
            name='address',
            field=models.TextField(blank=True, max_length=350, null=True),
        ),
    ]
