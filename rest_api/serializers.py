# Import required component
from rest_framework import serializers
from .models import logs, clients, projects, tags

# What are serializers?
# "Serializers in Django REST Framework are responsible for converting objects into data types understandable by javascript and 
# front-end frameworks. Serializers also provide deserialization, allowing parsed data to be converted back into complex types, 
# after first validating the incoming data." - GeeksforGeeks

# Serializer for logs CRUD
class logsCRUDSerializer(serializers.ModelSerializer):
    # Defines what models to use and what data is serialised
    class Meta:
        # Defines the table used by the serializer
        model = logs
        # Defines the fields to be serialised
        fields = ['id', 'time', 'date', 'descriptionRaw', 'tags', 'client', 'project', 'user']
        
# Serializer for clients CRUD
class clientsCRUDSerializer(serializers.ModelSerializer):
    # Defines what models to use and what data is serialised
    class Meta:
        # Defines the table used by the serializer
        model = clients
        # Defines the fields to be serialised
        fields = ['id', 'type', 'name', 'user']    
    
# Serializer for projects CRUD   
class projectsCRUDSerializer(serializers.ModelSerializer):
    # Defines what models to use and what data is serialised
    class Meta:
        # Defines the table used by the serializer
        model = projects
        # Defines the fields to be serialised
        fields = ['id', 'type', 'name', 'user']        
    
    
# Serializer for tags CRUD
class tagsCRUDSerializer(serializers.ModelSerializer):
    # Defines what models to use and what data is serialised
    class Meta:
        # Defines the table used by the serializer
        model = tags
        # Defines the fields to be serialised
        fields = ['id', 'name', 'billable', 'user']   
    