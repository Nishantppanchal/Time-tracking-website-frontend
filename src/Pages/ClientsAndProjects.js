/* eslint-disable react-hooks/exhaustive-deps */
// Import MUI components
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import './../Styles/Home.css';
// Import axios instance
// Import fetching components
import fetchCPData from '../Components/LoadData/LoadCPData';
// Import redux components
import { useSelector } from 'react-redux';
// Import custom components
import Header from '../Components/Header';
// Import luxon component
import { CssBaseline, Typography } from '@mui/material';
import CPLister from '../Components/CPLister';
import ClientsAndProjectsLoading from '../Loading Components/ClientsAndProjectsLoading';

function ClientAndProjects() {
  // Stores clients and projects
  const CPData = useSelector((state) => state.CPData.value);
  const [isCPDataLoading, setIsCPDataLoading] = useState(
    // If CPData is not empty make it false, else make it true
    CPData.length > 0 ? false : true
  );
  const [clientData, setClientData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    var clients = [];
    var projects = [];
    for (const CP of CPData) {
      if (CP.type === 'clients') {
        clients.push(CP);
      } else {
        projects.push(CP);
      }
    }

    setClientData(clients);
    setProjectData(projects);
  }, [CPData]);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the CPData has not loaded yet
    if (isCPDataLoading === true) {
      // Runs the function that fetches the CPData
      fetchCPData(setIsCPDataLoading);
      // Otherwise, if the CPData has already been loaded
    }
  }, []);

  if (!isCPDataLoading) {
    return (
      <div width='100%'>
        <CssBaseline />
        <Header page='clients and projects' />
        <Grid
          container
          spacing={2}
          justifyContent='center'
          alignItems='flex-start'
          margin='1rem'
          width='auto'
        >
          <Grid item xs={6}>
            <Typography variant='h6' width='100%' align='center'>
              Clients
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h6' width='100%' align='center'>
              Projects
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <CPLister CPData={clientData} type='client' />
          </Grid>
          <Grid item xs={6}>
            <CPLister CPData={projectData} type='project' />
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <ClientsAndProjectsLoading />;
  }
}

export default ClientAndProjects;
