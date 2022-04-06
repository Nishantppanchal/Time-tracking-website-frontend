# Imports the required components
from django.urls import path
from django.urls.conf import include
from rest_framework.routers import DefaultRouter
from .views import clientProjectGet, clientsCRUD, logsCRUD, projectsCRUD, tagsCRUD, doesTagExist, generateReport, getAllLogs

# Don't put app name as it causes errors

# Use router to automatically generate CRUD urls
router = DefaultRouter()
# Registers logs CRUD
router.register('logs', logsCRUD, basename='logsCRUD')
# Registers clients CRUD
router.register('clients', clientsCRUD, basename='clientsCRUD')
# Registers projects CRUD
router.register('projects', projectsCRUD, basename='projectsCRUD')
# Registers tags CRUD
router.register('tags', tagsCRUD, basename='tagsCRUD')

# Creates API endpoints
urlpatterns = [
    # URL for authentication
    path('auth/', include('rest_framework_social_oauth2.urls')),
    # URLs for all the CRUDs
    path('CRUD/', include(router.urls)),
    # URL to get all clients and projects
    path('clientProjectGet/', clientProjectGet.as_view()),
    # URL to see if tag exists
    path('doesTagExist/', doesTagExist.as_view()),
    # URL to generate reports
    path('generateReport/', generateReport.as_view()),
    # URL to get all logs
    path('getAllLogs/', getAllLogs.as_view())
]
