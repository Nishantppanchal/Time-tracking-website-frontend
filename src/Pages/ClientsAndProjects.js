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
import Grid from '@mui/material/Grid';
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
import { deleteCP } from '../Features/CPData';
import { CssBaseline, Typography } from '@mui/material';
import CPLister from '../Components/CPLister';
import ClientsAndProjectsLoading from '../Loading Components/ClientsAndProjectsLoading';

function ClientAndProjects() {
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();
  // Create navigate function
  const navigate = useNavigate();

  // Stores clients and projects
  const CPData = useSelector((state) => state.CPData.value);
  const [isCPDataLoading, setIsCPDataLoading] = useState(
    // If CPData is not empty make it false, else make it true
    CPData.length > 0 ? false : true
  );
  const [clientData, setClientData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  const projectColumns = [
    { field: 'name', headerName: 'Name', width: 190 },
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
            handleProjectDelete(params.row.id);
          }}
          label='Delete'
        />,
        // Edit button
        <GridActionsCellItem
          // Renders a edit button
          icon={<EditIcon />}
          onClick={() => {
            // Runs handleLogEdit to push the user to the edit page
            handleProjectEdit(params.row.id);
          }}
          label='Edit'
        />,
      ],
    },
  ];

  const clientColumns = [
    { field: 'name', headerName: 'Name', width: 190 },
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
            handleClientDelete(params.row.id);
          }}
          label='Delete'
        />,
        // Edit button
        <GridActionsCellItem
          // Renders a edit button
          icon={<EditIcon />}
          onClick={() => {
            // Runs handleLogEdit to push the user to the edit page
            handleClientEdit(params.row.id);
          }}
          label='Edit'
        />,
      ],
    },
  ];

  useEffect(() => {
    var clients = [];
    var projects = [];
    for (const CP of CPData) {
      if (CP.type == 'clients') {
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

  function handleProjectDelete(id) {
    const url = 'CRUD/projects/' + id + '/';
    axiosInstance.delete(url);
    dispatch(deleteCP({ id: id, type: 'projects' }));
  }

  function handleProjectEdit(id) {
    navigate('/clients-and-projects/edit/projects/' + id);
  }

  function handleClientDelete(id) {
    const url = 'CRUD/clients/' + id + '/';
    axiosInstance.delete(url);
    dispatch(deleteCP({ id: id, type: 'clients' }));
  }

  function handleClientEdit(id) {
    navigate('/clients-and-projects/edit/clients/' + id);
  }

  if (!isCPDataLoading) {
    return (
      <div width='100%'>
        <CssBaseline />
        <Header page='clients and projects' />
        <Grid container spacing={2} justifyContent='center' alignItems='flex-start' margin='1rem' width='auto'>
          <Grid item xs={6}>
            <Typography variant='h6' width='100%' align='center'>Clients</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h6' width='100%' align='center'>Projects</Typography>
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
