# Generated by Django 3.2.10 on 2022-02-02 10:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='time_is_on',
        ),
    ]
