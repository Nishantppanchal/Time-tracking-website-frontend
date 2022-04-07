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
import CircularProgress from '@mui/material/CircularProgress';
// Import axios instance
import axiosInstance from '../Axios.js';
// Import fetching components
import fetchTagsData from './LoadData/LoadTags';
import fetchLogs from './LoadData/LoadLogs';
import fetchCPData from './LoadData/LoadCPData';
// Import redux components
import { useSelector, useDispatch } from 'react-redux';
import { addToLoadedLogsNumber, deleteLog } from '../Features/Logs';
// Import custom components
import LogHeader from './LogHeader';
import Header from './Header';
import DescriptionWithTagsInput from './DescriptionWithTags';
// Import luxon component
import { DateTime } from 'luxon';

import { addAllLogs, setAllLogsLoaded } from '../Features/Logs';

function Logs() {
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();
  // Create navigate function
  const navigate = useNavigate();

  // Defines all the states
  // Stores data from server
  // Stores data for a log
  const logData = useSelector((state) => state.logs.value.logs);
  // Stores clients and projects
  const CPData = useSelector((state) => state.CPData.value);
  // Store tags
  const tagsData = useSelector((state) => state.tags.value);
  // Stores whether data has loaded or not
  // Stores whether all the clients and projects have loaded
  const [isCPDataLoading, setIsCPDataLoading] = useState(
    // If CPData is not empty make it false, else make it true
    CPData.length > 0 ? false : true
  );
  // Stores whether all the tags have loaded
  const [isTagsDataLoading, setIsTagsDataLoading] = useState(
    // If tagsData is not empty make it false, else make it true
    tagsData.length > 0 ? false : true
  );
  // Other states
  // Stores whether all the logs have been loaded
  const allLogsLoaded = useSelector((state) => state.logs.value.allLogsLoaded);

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
              (data) =>
                data.id === params.row.project && data.type === 'projects'
            ).name,
    },
    // Sets the time column
    { field: 'time', headerName: 'duration', width: 90, type: 'number' },
    // Sets the description column
    {
      field: 'descriptionRaw',
      headerName: 'description',
      width: 500,
      renderCell: (params) => (
        // Custom field for description with tags
        <DescriptionWithTagsInput
          // Set initial of this component not to be empty
          empty={false}
          // Pass through all the tags
          tags={null}
          // Assign handleDescriptionWithTagsData to be run to process the content in this component
          data={() => {
            return null;
          }}
          // Assign clear to null as field clearing is not required here
          clear={null}
          // Provides the initial state to the component
          intialField={params.value}
          // Sets readOnly to false so user can edit the description
          readOnly={true}
        />
      ),
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
    // If the log data has not loaded yet
    if (!allLogsLoaded) {
      // Send the a get request to get the logs
      // loadedLogNumber allows the logs to be progressively loaded
      // As the user want more logs, the number increase, causing the next set of logs to be returned
      axiosInstance
        .get('getAllLogs/')
        // Handles the response
        .then((response) => {
          dispatch(addAllLogs(response.data));
          dispatch(setAllLogsLoaded(true));
        })
        // Handles errors
        .catch((error) => {
          // If the access token is invalid
          if (
            error.response.data.detail ===
            'Invalid token header. No credentials provided.'
          ) {
            // Adds the reponse data to logs array in the logs redux state
            dispatch(addAllLogs(error.response.data.requestData.data));
            dispatch(setAllLogsLoaded(true));
          }
        });
    }
  }, []);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the CPData has not loaded yet
    if (isCPDataLoading) {
      // Runs the function that fetches the CPData
      fetchCPData(setIsCPDataLoading);
    }
  }, []);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the tags has not loaded yet
    if (isTagsDataLoading) {
      // Runs the function that fetches the tags
      fetchTagsData(setIsTagsDataLoading);
    }
  }, []);

  // Handles deleting log
  function handleLogDelete(id) {
    // Generates the url to which a request should be sent
    const url = '/CRUD/logs/' + id + '/';
    // Sends a delete request to delete the log
    axiosInstance.delete(url);
    // Removes the deleted tag from logData
    dispatch(deleteLog(id));
  }

  // Handles editing log button click
  function handleLogEdit(id) {
    // Dynamically pushes user to edit page of the specific log using it's ID
    navigate('/logs/edit/' + id);
  }

  if (!isCPDataLoading && allLogsLoaded && !isTagsDataLoading) {
    return (
      <div>
        <Header />
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
      </div>
    );
  } else {
    return <Skeleton />;
  }
}

export default Logs;
