# Generated by Django 3.2.10 on 2022-02-13 09:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0008_auto_20220129_0235'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='logs',
            name='description',
        ),
    ]