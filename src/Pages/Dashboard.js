/* eslint-disable react-hooks/exhaustive-deps */
// Import MUI components
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import './../Styles/Home.css';
// Import axios instance
// Import fetching components
import fetchCPData from '../Components/LoadData/LoadCPData';
import fetchLogs from '../Components/LoadData/LoadLogs';
import fetchTagsData from '../Components/LoadData/LoadTags';
// Import redux components
import { useDispatch, useSelector } from 'react-redux';
import { addToLoadedLogsNumber } from '../Features/Logs';
// Import custom components
import Header from '../Components/Header';
import LogHeader from '../Components/LogHeader';
import LogsLister from '../Components/LogsLister';
// Import luxon component
import { CssBaseline } from '@mui/material';
import DashboardLoading from '../Loading Components/DashboardLoading';

function Dashboard() {
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();
  // Create navigate function

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
  // Stores whether the logs have loaded
  const [isLogDataLoading, setIsLogDataLoading] = useState(
    // If logData is not empty make it false, else make it true
    logData.length > 0 ? false : true
  );
  // Stores whether more logs a currently loading in or not
  const [isMoreLogsLoading, setIsMoreLogsLoading] = useState(false);
  // Other states
  // Stores whether all the logs have been loaded
  const allLogsLoaded = useSelector((state) => state.logs.value.allLogsLoaded);

  // Runs this code on every render/update after the DOM has updated if setLogData or loadedLogsNumber have changed
  useEffect(() => {
    // If the log data has not loaded yet
    if (isLogDataLoading) {
      // Runs the function that fetches the logs
      // The required setState function are passed in as well
      fetchLogs(setIsLogDataLoading);
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

  // Handles loading more tags
  function loadMore(event) {
    // Prevents the default button action
    event.preventDefault();

    // Add 50 to the current loadedLogsNumber
    // This causes 50 more tags to be loaded
    dispatch(addToLoadedLogsNumber(25));
    // Set isMoreLogLoading to true to show loading animation
    setIsMoreLogsLoading(true);
    // Fetchs more logs
    // setIsMoreLogsLoading is passthrough so that a loading icon can be displayed while data loads
    fetchLogs(setIsMoreLogsLoading);
  }

  // If all the data has loaded
  if (!isCPDataLoading && !isTagsDataLoading && !isLogDataLoading) {
    // Render this JSX code
    return (
      // Wrapper div
      <>
        <CssBaseline />
        {/* App bar */}
        <Header page='dashboard' />
        {/* LogHeader custom conponent */}
        <LogHeader />
        {/* LogLister */}
        <LogsLister logs={logData} CPData={CPData} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          {/* Button that loads more logs */}
          {/* If loading, loading animation will be played */}
          <LoadingButton
            // Sets the variant of the button to outlined
            variant='contained'
            // Runs the function loadMore on click causing more logs to load in
            onClick={loadMore}
            // If there are no more logs to load, then the button is disabled
            disabled={allLogsLoaded}
            // Add loading animation
            // Disable shrink is used a otherwise the animation is glitchy
            startIcon={<ArrowDownIcon />}
            loading={isMoreLogsLoading}
          >
            Load More
          </LoadingButton>
        </div>
      </>
    );
    // If all the data has not loaded yet
  } else {
    // Render this JSX code (loading component)
    return <DashboardLoading />;
  }
}

export default Dashboard;
