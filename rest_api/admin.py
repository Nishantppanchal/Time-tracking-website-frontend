# Import required components
from django.contrib import admin
from .models import clients, projects, tags, logs

# Allow these tables to be viewed and edited in the admin page
admin.site.register(logs)
admin.site.register(tags)
admin.site.register(clients)
admin.site.register(projects)