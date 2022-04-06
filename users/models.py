# Import required components
from django.db import models
from django.contrib.auth.base_user import (
    AbstractBaseUser, BaseUserManager
)
from django.db.models.fields import EmailField
from django.contrib.auth.models import PermissionsMixin

# Creates custom manager for the the user table
class userManager(BaseUserManager):
    # Defines how users are created
    def create_user(self, email, first_name, last_name, password):
        # Enforces user requiring a email
        if not email:
            raise ValueError('Users must have an email address')
        
        # Normalises the email address by lowercasing the domain part of it
        email = self.normalize_email(email)
        # Makes only the first letter of the first name upper case while the rest are lower case
        first_name = first_name[0].upper() + first_name[1:].lower()
        # Makes only the first letter of the last name upper case while the rest are lower case
        last_name = last_name[0].upper() + last_name[1:].lower()
        # Create a user instance with all the user's data
        user = self.model(email=email,first_name=first_name, last_name=last_name, is_active=True, is_staff=False)
        # Sets the user password
        user.set_password(password)
        # Saves the user instance to the database
        user.save()
        # Return the user instance
        return user
    def create_superuser(self, email, first_name, last_name, password):
        # Enforces user requiring a email
        if not email:
            raise ValueError('Users must have an email address')
        
        # Normalises the email address by lowercasing the domain part of it
        email = self.normalize_email(email)
        # Makes only the first letter of the first name upper case while the rest are lower case
        first_name = first_name[0].upper() + first_name[1:].lower()
        # Makes only the first letter of the last name upper case while the rest are lower case
        last_name = last_name[0].upper() + last_name[1:].lower()
        # Create a user instance with all the user's data
        # is_staff is true and is_superuser is True making the user a admin
        user = self.model(email=email,first_name=first_name, last_name=last_name, is_active=True, is_staff=True, is_superuser=True)
        # Sets the user password
        user.set_password(password)
        # Saves the user instance to the database
        user.save()
        # Return the user instance
        return user
    
# Creates a custom user table
class users(AbstractBaseUser, PermissionsMixin):
    # First name field
    # Max number of characters is 100
    first_name = models.CharField(max_length=100)
    # Last name field
    # Max number of characters is 100
    last_name = models.CharField(max_length=100)
    # Email field
    # Has to be unique, meaning that no email can be used twice
    email = models.EmailField(unique=True)
    # For email verification
    is_active = models.BooleanField(default=False)
    
    # For making admin users
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    # Sets the userManager as the manager
    objects = userManager()
    
    # Set the primary key to the email field
    USERNAME_FIELD = 'email'
    
    # Sets the required fields to first name and last name fields
    REQUIRED_FIELDS = ['first_name', 'last_name']
    