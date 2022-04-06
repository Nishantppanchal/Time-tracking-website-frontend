# Import required components
from django.contrib import admin
from .models import users

# Allow these tables to be viewed and edited in the admin page
admin.site.register(users)