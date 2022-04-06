# Import required components
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from rest_framework.documentation import include_docs_urls

# Sets the base urls
urlpatterns = [
    # Sets the admin management page url
    path('admin/', admin.site.urls),
    # Sets the REST API urls linking it to the urls in rest_api
    # The base url is api/
    path('api/', include('rest_api.urls')),
    # Sets more REST API urls linking it to the urls in users
    # The base url is api/
    path('api/', include('users.urls')),
    # Sets the API documentation url 
    path('docs/', include_docs_urls(title='API documentation'))
]
