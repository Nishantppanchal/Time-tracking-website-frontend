# Imports the required components
from urllib.parse import non_hierarchical
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from uritemplate import partial
from .serializers import clientsCRUDSerializer, logsCRUDSerializer, projectsCRUDSerializer, tagsCRUDSerializer
from .models import clients, logs, projects, tags
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework import status
from django.db.models import Sum

# View for logs CRUD
class logsCRUD(viewsets.ModelViewSet):
    # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]
    # Sets the serializer
    serializer_class = logsCRUDSerializer

    # Customizes what data is retrieved
    def get_queryset(self):
        # Sets the attribute number from the params in the URL
        number = self.request.query_params.get('number')
        # Sets the user ID from the request
        user = self.request.user

        # If the number is None
        if number is None:
            # Return all the logs in one go
            return logs.objects.filter(user=user)
        # Otherwise progressively return the logs
        else:
            # Sets the start log to the integer number
            start = int(number)
            # Sets the end log to the integer number + 100
            end = int(number) + 2
            # Gets the index of the last log (start from zero)
            count = logs.objects.filter(user=user).count() - 1

            # If the end log is within all the logs
            if end <= count:
                # Return all the logs from the start log to the log before the end log
                return logs.objects.filter(user=user).order_by('-date')[start:end]
            # If the start log is within all the logs
            elif start <= count:
                # Return all the logs after and including the start log
                return logs.objects.filter(user=user).order_by('-date')[start:]
            # Otherwise, if both the start log and end log are not within all the logs
            else:
                # Return a empty list
                return logs.objects.filter(user=user).none()

    # Customizes what happens on a post request
    def create(self, request):
        # Data is run through the serialiser
        serializer = logsCRUDSerializer(data=request.data)
        # If the data is serialisable
        if serializer.is_valid():
            # Save the data to the log model
            serializer.save()
            # Gets the log created
            log = serializer.data
            # Return the log created and a 201 created status code
            return Response(log, status=status.HTTP_201_CREATED)
        # If the data is not serialisable
        # Return the errors and a 400 bad request status code
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for getting all logs
class getAllLogs(generics.GenericAPIView):
        # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]

    # Defines what happens on a get request
    def get(self, request, *args, **kwargs):
        # Sets the user ID from the request
        user = request.user
        # Gets the user's logs
        logsData = logs.objects.filter(user=user);
        # Serialise the logs
        logsSerialised = logsCRUDSerializer(logsData, many=True)
        # Return all the logs and a 200 ok status code
        return Response(logsSerialised.data, status=status.HTTP_200_OK);

# View for clients CRUD
class clientsCRUD(viewsets.ModelViewSet):
    # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]
    # Sets the serializer
    serializer_class = clientsCRUDSerializer

    # Customizes what data is retrieved
    def get_queryset(self):
        # Sets the user ID from the request
        user = self.request.user
        # Returns the user's clients
        return clients.objects.filter(user=user)

    # Customizes what happens on a post request
    def create(self, request):
        # Data is run through the serialiser
        serializer = clientsCRUDSerializer(data=request.data)
        # If the data is serialisable
        if serializer.is_valid():
            # Save the data to the clients model
            serializer.save()
            # Gets client created
            client = serializer.data
            # Return the client created and a 201 created status code
            return Response(client, status=status.HTTP_201_CREATED)
        # If the data is not serialisable
        # Return the errors and a 400 bad request status code
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for projects CRUD
class projectsCRUD(viewsets.ModelViewSet):
    # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]
    # Sets the serializer
    serializer_class = projectsCRUDSerializer

    # Customizes what data is retrieved
    def get_queryset(self):
        # Sets the user ID from the request
        user = self.request.user
        # Returns the user's projects
        return projects.objects.filter(user=user)

    # Customizes what happens on a post request
    def create(self, request):
        # Data is run through the serialiser
        serializer = projectsCRUDSerializer(data=request.data)
        # If the data is serialisable
        if serializer.is_valid():
            # Save the data to the projects model
            serializer.save()
            # Gets project created
            project = serializer.data
            # Return the client created and a 201 created status code
            return Response(project, status=status.HTTP_201_CREATED)
        # If the data is not serialisable
        # Return the errors and a 400 bad request status code
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for tags CRUD
class tagsCRUD(viewsets.ModelViewSet):
    # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]
    # Sets the serializer
    serializer_class = tagsCRUDSerializer

    # Customizes what data is retrieved
    def get_queryset(self):
        # Sets the user ID from the request
        user = self.request.user
        # Returns the user's tags
        return tags.objects.filter(user=user)

    # Customizes what happens on a post request
    def create(self, request):
        # Data is run through the serialiser
        serializer = tagsCRUDSerializer(data=request.data)
        # If the data is serialisable
        if serializer.is_valid():
            # Save the data to the projects model
            serializer.save()
            # Gets the tag created
            tag = serializer.data
            # Return the tag created and a 201 created status code
            return Response(tag, status=status.HTTP_201_CREATED)
        # If the data is not serialisable
        # Return the errors and a 400 bad request status code
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Creates a generic endpoint to get all the user's clients and projects
class clientProjectGet(generics.GenericAPIView):
    # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]

    # Defines what happens on a get request
    def get(self, request, *args, **kwargs):
        # Sets the user ID from the request
        user = request.user
        # Filters the clients table for the user's clients
        clientsData = clients.objects.filter(user=user)
        # Filters the projects table for the user's projects
        projectsData = projects.objects.filter(user=user)

        # Serialises the user's clients
        clientsSerialized = clientsCRUDSerializer(clientsData, many=True)
        # Serializers the user's projects
        projectsSerialized = projectsCRUDSerializer(projectsData, many=True)
        # Combines the serializered data
        data = clientsSerialized.data + projectsSerialized.data

        # Return the data to the frontend
        return Response(data, status=status.HTTP_200_OK)

# Creates a generic endpoint to check whether a tag exists
class doesTagExist(generics.GenericAPIView):
    # Requires authentication to access this endpoint
    permission_classes = [IsAuthenticated]

    # Defines what happens on a get request
    def get(self, request):
        # Sets the user ID from the request
        user = request.user
        # Sets the attribute name from the params in the URL
        name = request.query_params.get('name')

        # If a tag with the name specificed made by the user specificed exists
        if tags.objects.filter(user=user, name=name).exists():
            # Sets data to a dictionary with exists as true and the id as the tag id
            # the [0] is to prevent accidential duplicates causing errors
            data = {'exists': True, 'id': tags.objects.filter(user=user, name=name)[
                0].id}
        else:
            # Sets data to a dictionary with exists as false
            data = {'exists': False}

        # Return the data to the frontend
        return Response(data, status=status.HTTP_200_OK)

# Creates a generic endpoint for generate reports
class generateReport(APIView):
    # Requires authentication to access this endpoint
    permission_classess = [IsAuthenticated]

    # Defines what happens if a POST request is sent to this view
    def post(self, request):
        # Sets the user ID from the request
        user = request.user
        # Sets the clients array from the request body
        clients = request.data['clients']
        # Sets the projects array from the request body
        projects = request.data['projects']
        # Sets the tags array from the request body
        tags = request.data['tags']

        # Extracts the ids from the the data sent over
        # Creates a variable to store the client ids
        clientIDs = []
        # For all the clients
        for client in clients:
            # Add their ids to the clientIDs array
            clientIDs.append(client['id'])
        # Creates a variable to store the project ids
        projectIDs = []
        # For all the projects
        for project in projects:
            # Add their ids to the projectIDs array
            projectIDs.append(project['id'])
        # Creates a variable to store the tag ids
        tagIDs = []
        # For all the tags
        for tag in tags:
            # Add their ids to the tag IDs array
            tagIDs.append(tag['id'])

        # # # Add billable or not for each log -> if it has a not billable tag -> not billablec
        # If there are tags in the tags array
        if tags:
            # Filter for all the logs made by the user with the clients specificed and have the one of the tags specificed
            # Or the logs made by the user with the projects specificed and have one of the tags specificed
            logsData = logs.objects.filter(user=user, client_id__in=clientIDs, tags_id__in=tagIDs).order_by('date') | logs.objects.filter(
                user=user, project_id__in=projectIDs, tags_id__in=tagIDs).order_by('date')
        # If are not any tags in the tags array
        else:
            # Filter for all the logs made by the user with the clients or projects specificed 
            logsData = logs.objects.filter(user=user, client_id__in=clientIDs).order_by('date') | logs.objects.filter(
                user=user, project_id__in=projectIDs).order_by('date')
        
        # Find the total time for all the logs
        totalTime = logsData.aggregate(Sum('time'))['time__sum']
        # If totalTime is None
        if totalTime == None:
            # Set it to 0
            totalTime = 0

        # Serialise the logs
        logsSerialised = logsCRUDSerializer(logsData, many=True)

        # Creates a responseData dictionary to return all the data
        responseData = {
            # Set the totalTime key to the totalTime for all the logs
            'totalTime': totalTime,
            # Set the logs key to all the logs 
            'logs': logsSerialised.data,
        }

        # Create a variable to store the time spent on each client and project
        CPTimes = []
        # For all the clients
        for client in clients:
            # Get the time spent on that client
            clientTime = logsData.filter(client_id=client['id']).aggregate(Sum('time'))['time__sum']
            # If the time spent on that client is None
            if clientTime == None:
                # Set it to 0
                clientTime = 0
            
            # Add a dictionary to the CPTimes array
            CPTimes.append({
                # Sets the id key to the id of the client
                'id': client['id'],
                # Sets the name key to the name of the client
                'name': client['name'],
                # Sets the type key to clients
                'type': 'clients',
                # Sets the time key to the amount of time spent on the client
                'time': clientTime,
            })

        # For all the projects
        for project in projects:
            # Get the time spent on that project
            projectTime = logsData.filter(project_id=project['id']).aggregate(Sum('time'))['time__sum']
            # If the time spent on that project is None
            if projectTime == None:
                # Set it to 0
                projectTime = 0
                
            # Add a dictionary to the CPTimes array
            CPTimes.append({
                # Sets the id key to the id of the project
                'id': project['id'],
                # Sets the name key to the name of the project
                'name': project['name'],
                # Set the type key to project
                'type': 'projects',
                # Set the time key to the amount of time spent on the project
                'time': projectTime,
            })

        # Set the CPTimes key in the responseData to the CPTimes array
        responseData['CPTimes'] = CPTimes

        # Creates a variable to store the time spent on each tag
        tagTimes = []
        # For each tag
        for tag in tags:
            # Get the time spent on the tag
            tagTime = logsData.filter(tags_id=tag['id']).aggregate(Sum('time'))['time__sum']
            # If the time spent on the tag is None
            if tagTime == None:
                # Set it to 0
                tagTime = 0
                
            # Add a dictionary to the tagTimes array
            tagTimes.append({
                # Sets the id key to the id of the tag
                'id': tags['id'],
                # Sets the name key to the name of the tag
                'name': tag['name'],
                # Sets the time key to the amount of time spent on the tag
                'time': tagTime,
            })
        # Sets the tagTimes key in the responseData to the tagTimes array
        responseData['tagTimes'] = tagTimes

        # Returns the data to the frontend
        return Response(responseData, status=status.HTTP_200_OK)
