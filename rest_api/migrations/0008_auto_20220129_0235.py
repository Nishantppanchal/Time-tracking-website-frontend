# Generated by Django 3.2.10 on 2022-01-28 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0007_logs_descriptionraw'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clients',
            name='colour',
        ),
        migrations.RemoveField(
            model_name='projects',
            name='colour',
        ),
    ]
