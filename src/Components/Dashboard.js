/* eslint-disable react-hooks/exhaustive-deps */
// Import MUI components
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import './../Styles/Home.css';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// Import axios instance
import axiosInstance from '../Axios.js';
// Import fetching components
import fetchTagsData from './LoadData/LoadTags';
import fetchLogs from './LoadData/LoadLogs';
import fetchCPData from './LoadData/LoadCPData';
// Import redux components
import { useSelector } from 'react-redux';
// Import custom components
import LogHeader from './LogHeader';
import Header from './Header';

function Dashboard() {
  // Create navigate function
  const navigate = useNavigate();
  // Creates the function DateTime
  const { DateTime } = require('luxon');

  // Defines all the states
  // Stores data from server
  // Stores data for a log
  const [logData, setLogData] = useState([]);
  // Stores tags
  const tagsData = useSelector((state) => state.tags.value);
  // Stores clients and projects
  const CPData = useSelector((state) => state.CPData.value);
  // Stores whether data has loaded or not
  // Stores whether all the clients and projects have loaded
  const [isCPDataLoading, setIsCPDataLoading] = useState(true);
  // Stores whether all the tags have loaded
  const [isTagsDataLoading, setIsTagsDataLoading] = useState(true);
  // Stores whether the logs have loaded
  const [isLogDataLoading, setIsLogDataLoading] = useState(true);
  // Other states
  // Stores the number logs loaded to allow gradual loading
  const [loadedLogsNumber, setLoadedLogsNumber] = useState(0);
  // Stores whether all the logs have been loaded
  const [allLogsLoaded, setAllLogsLoaded] = useState(false);

  // Creates the columns in the logs table
  const columns = [
    // Sets the data column
    {
      field: 'date',
      headerName: 'date',
      width: 90,
      type: 'date',
      // Defines how the value is retrieved
      valueGetter: (params) =>
        // Convert the date from one format to another
        DateTime.fromFormat(params.row.date, 'yyyy-LL-dd').toFormat(
          'dd/LL/yyyy'
        ),
    },
    // Sets the client and project column
    {
      field: 'client/project',
      headerName: 'client/project',
      width: 90,
      // Defines how the value is retrieved
      valueGetter: (params) =>
        // If the log is for a client, run first expression, else run second
        params.row.client
          ? // Finds the client with the same id as the one recorded in the log and gets it's name
            CPData.find(
              (data) => data.id === params.row.client && data.type === 'clients'
            ).name
          : // Finds the project with the same id as the one recorded in the log and gets it's name
            CPData.find(
              (data) => data.id === params.row.project && data.type === 'projects'
            ).name,
    },
    // Sets the time column
    { field: 'time', headerName: 'duration', width: 90, type: 'number' },
    // Sets the description column
    { field: 'description', headerName: 'description', width: 180 },
    // Sets the tags column
    {
      field: 'tags',
      headerName: 'tags',
      width: 90,
      // Defines how the value is retrieved
      valueGetter: (params) => {
        // Creates a variable that store a empty array
        var tags = [];
        // For all the tags in the log
        for (const tag of params.row.tags) {
          // Find the tag name from it id in the log and adds it the tags array
          tags.push(tagsData.find((data) => data.id === tag).name.toString());
        }
        // Join the array of tags with , inbetween them
        return tags.join(', ');
      },
    },
    // Sets the edit and delete button
    {
      field: 'edit',
      type: 'actions',
      width: 80,
      // Defines what buttons are rendered
      getActions: (params) => [
        // Delete button
        <GridActionsCellItem
          // Renders a delete icon
          icon={<DeleteIcon />}
          onClick={() => {
            // Runs handleLogDelete to delete the log
            handleLogDelete(params.row.id);
          }}
          label='Delete'
        />,
        // Edit button
        <GridActionsCellItem
          // Renders a edit button
          icon={<EditIcon />}
          onClick={() => {
            // Runs handleLogEdit to push the user to the edit page
            handleLogEdit(params.row.id);
          }}
          label='Edit'
        />,
      ],
    },
  ];

  // Runs this code on every render/update after the DOM has updated if setLogData or loadedLogsNumber have changed
  useEffect(() => {
    // Runs the function that fetches the logs
    // The required states and setState functions are passed in as well
    fetchLogs(
      loadedLogsNumber,
      setLogData,
      logData,
      setAllLogsLoaded,
      setIsLogDataLoading
    );
  }, [setLogData, loadedLogsNumber]);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the CPData redux state is empty
    if (CPData.length === 0) {
      // Runs the function that fetches the CPData
      fetchCPData(setIsCPDataLoading);
      // Otherwise, if the CPData has already been loaded
    } else {
      // Set isCPDataLoading to false
      setIsCPDataLoading(false);
    }
  }, []);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the tags redux state is empty
    if (tagsData.length === 0) {
      // Runs the function that fetches the tags
      fetchTagsData(setIsTagsDataLoading);
      // Otherwise, if the tags have not already been loaded
    } else {
      // Set isTagsDataLoading to false
      setIsTagsDataLoading(false);
    }
  }, []);

  // Handles loading more tags
  function loadMore(event) {
    // Prevents the default button action
    event.preventDefault();

    // Add 50 to the current loadedLogsNumber
    // This causes 50 more tags to be loaded
    setLoadedLogsNumber(loadedLogsNumber + 50);
  }

  // Handles new log creation
  function handleNewLog(data) {
    // Adds the new log to logData
    setLogData([data, ...logData]);
  }

  // Handles deleting log
  function handleLogDelete(id) {
    // Generates the url to which a request should be sent
    const url = '/CRUD/logs/' + id + '/';
    // Sends a delete request to delete the log
    axiosInstance.delete(url);
    // Removes the deleted tag from logData
    setLogData(
      // Filters out the log that was deleted
      logData.filter((log) => {
        return log.id !== id;
      })
    );
  }

  // Handles editing log button click
  function handleLogEdit(id) {
    // Dynamically pushes user to edit page of the specific log using it's ID
    navigate('/edit/' + id);
  }

  // If all the data has loaded
  if (!isCPDataLoading && !isTagsDataLoading && !isLogDataLoading) {
    // Render this JSX code
    return (
      // Wrapper div
      <div>
        {/* App bar */}
        <Header />
        {/* LogHeader custom conponent */}
        <LogHeader addLog={handleNewLog} />
        {/* Styled wrapper div */}
        <div style={{ height: 400, width: '100%' }}>
          {/* Table for all the logs */}
          <DataGrid
            // Sets the rows to logs
            rows={logData}
            // Sets the columns to the defined above column structure
            columns={columns}
            // Stores the data in descend order by date
            sortModel={[
              {
                field: 'date',
                sort: 'desc',
              },
            ]}
            // Sets the max page size to 100
            pageSize={100}
            // Sets the rowPerPage option to only be setable to 100
            // This cause the selector for how many row per page to also be removed
            rowsPerPageOptions={[100]}
          />
        </div>
        {/* Button that loads more logs */}
        <Button 
          // Sets the variant of the button to outlined
          variant='outlined' 
          // Runs the function loadMore on click causing more logs to load in
          onClick={loadMore} 
          // If there are no more logs to load, then the button is disabled
          disabled={allLogsLoaded}
        >
          Load More
        </Button>
      </div>
    );
    // If all the data has not loaded yet
  } else {
    // Render this JSX code (loading component)
    return <Skeleton />;
  }
}

export default Dashboard;
