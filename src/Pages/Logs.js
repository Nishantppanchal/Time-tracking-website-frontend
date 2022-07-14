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
import fetchTagsData from '../Components/LoadData/LoadTags';
import fetchLogs from '../Components/LoadData/LoadLogs';
import fetchCPData from '../Components/LoadData/LoadCPData';
// Import redux components
import { useSelector, useDispatch } from 'react-redux';
import { addToLoadedLogsNumber, deleteLog } from '../Features/Logs';
// Import custom components
import LogHeader from '../Components/LogHeader';
import Header from '../Components/Header';
import DescriptionWithTagsInput from '../Components/DescriptionWithTags';
// Import luxon component
import { DateTime } from 'luxon';

import { addAllLogs, setAllLogsLoaded } from '../Features/Logs';
import LogLister from '../Components/LogsLister';
import LogListerLoading from '../Loading Components/LogListerLoading';
import LogsLoading from '../Loading Components/LogsLoading';
import { CssBaseline } from '@mui/material';

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

  if (!isCPDataLoading && allLogsLoaded && !isTagsDataLoading) {
    return (
      <div>
        <CssBaseline />
        <Header page='logs' />
        <LogLister logs={logData} CPData={CPData} />
      </div>
    );
  } else {
    return (
      <LogsLoading />
    );
  }
}

export default Logs;
