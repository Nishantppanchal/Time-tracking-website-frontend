# Imports required components
from django.db.models import fields
from rest_framework import serializers
from users.models import users

# What are serializers?
# "Serializers in Django REST Framework are responsible for converting objects into data types understandable by javascript and 
# front-end frameworks. Serializers also provide deserialization, allowing parsed data to be converted back into complex types, 
# after first validating the incoming data." - GeeksforGeeks

# Serializer for creating a user
class createUserSerializer(serializers.ModelSerializer):
    # Defines what models to use and what data is serialised
    class Meta:
        # Defines the table used by the serializer
        model = users
        # Defines the fields to be serialised
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        # The password field is set to write_only
        # This ensure that the field may be used when updating or creating an instance, but is not included data is returned.
        extra_kwargs = {'password': {'write_only': True}}
    
    # Defines how to create a user instance with validated data 
    def create(self, validated_data):
        # Creates a user instance with validated data
        user = users.objects.create_user(
            email = validated_data['email'],
            first_name = validated_data['first_name'], 
            last_name = validated_data['last_name'],
            password = validated_data['password']
        )
        # Returns the user instance
        return user
    
# Serialiser for getting user ID 
class getUserIdSerializer(serializers.ModelSerializer):
    # Defines what models to use and what data is serialised
    class Meta:
        # Defines the table used by the serializer
        model = users
        # Defines the fields to be serialised
        fields = ['id']