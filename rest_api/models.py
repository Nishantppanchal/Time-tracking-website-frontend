# Import required components
from django.db import models
from django.db.models.fields import DateField, TextField
from django.db.models.fields.related import ForeignKey
from users.models import users

# Tags table
class tags(models.Model):
    # Name field for tags
    # Max character lenght is 100
    # Can be left blank or be null
    # The default value is null
    name = models.CharField(max_length=100, default=None, blank=True, null=True)
    # Billable is a true or false field
    billable = models.BooleanField()
    
    # Foreign key linking tags to a user
    # One to many relationship 
    # One user can be linked to multiple tags, but one tag can only be linked to one user
    # If a user is deleted, their tags will also be deleted 
    user = ForeignKey(users, on_delete=models.CASCADE)
    
# Clients table
class clients(models.Model):
    # Type field
    # Identifies whether data is client or project when returned together to the frontend
    # By defualt it is clients
    # Max number of characters are 7, which is exactly how many clients has
    type = models.CharField(max_length=7, default='clients')
    # Name field for client
    # Max character number is 100
    name = models.CharField(max_length=100)
    
    # Foreign key linking clients to a user
    # One to many relationship 
    # One user can be linked to multiple clients, but one client can only be linked to one user 
    # If a user is deleted, their clients will also be deleted 
    user = ForeignKey(users, on_delete=models.CASCADE)

# Project table
class projects(models.Model):
    # Type field
    # Identifies whether data is client or project when returned together to the frontend
    # By defualt it is projects
    # Max number of characters are 8, which is exactly how many projects has
    type = models.CharField(max_length=8, default='projects')
    # Name field for client
    # Max character number is 100
    name = models.CharField(max_length=250)
    
    # Foreign key linking projects to a user
    # One to many relationship 
    # One user can be linked to multiple projects, but one project can only be linked to one user 
    # If a user is deleted, their projects will also be deleted 
    user = ForeignKey(users, on_delete=models.CASCADE)

# Logs table
class logs(models.Model):
    # Time field
    # Integer for number of minutes
    time = models.IntegerField()
    # Date field
    # Uses default datefield formating
    date = models.DateField()
    # Description field
    # Dscription raw field
    # Stores stringified JS code for the description field
    descriptionRaw = TextField()
    
    # Linking logs to tags
    # Many to many relatioship
    # A tag can have multiple logs and a log can have muliple tags
    # Can be blank
    tags = models.ManyToManyField(tags, blank=True)
    # Foreign key linking logs to a client
    # One to many relationship 
    # One client can be linked to multiple logs, but one log can only be linked to one client 
    # If a client is deleted, their logs will also be deleted
    # Can be blank or null 
    client = models.ForeignKey(clients, blank=True, null=True, on_delete=models.CASCADE)
    # Foreign key linking logs to a project
    # One to many relationship 
    # One project can be linked to multiple logs, but one log can only be linked to one project 
    # If a project is deleted, their logs will also be deleted
    # Can be blank or null 
    project = models.ForeignKey(projects, blank=True, null=True, on_delete=models.CASCADE)
    # Foreign key linking logs to a user
    # One to many relationship 
    # One user can be linked to multiple logs, but one log can only be linked to one user 
    # If a user is deleted, their logs will also be deleted 
    user = ForeignKey(users, on_delete=models.CASCADE)