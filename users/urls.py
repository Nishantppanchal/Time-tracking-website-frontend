# Imports the required components
from django.urls import path
from .views import customUserCreate, getUserId

# Sets the app name
app_name = 'user'

# Creates API endpoints
urlpatterns = [
    # URL to create user
    path('user/register/', customUserCreate.as_view(), name='createUser'),
    # URL to get user ID
    path('user/id/', getUserId.as_view(), name='getUserId'),
]