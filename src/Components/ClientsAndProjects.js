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
import { deleteCP } from '../Features/CPData';
import { Typography } from '@mui/material';

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
  });

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
      <div>
        <Header />
        <Typography>Clients</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            // Sets the rows to logs
            rows={clientData}
            // Sets the columns to the defined above column structure
            columns={clientColumns}
            // Sets the max page size to 100
            pageSize={100}
            // Sets the rowPerPage option to only be setable to 100
            // This cause the selector for how many row per page to also be removed
            rowsPerPageOptions={[100]}
          />
        </div>
        <Typography>Projects</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            // Sets the rows to logs
            rows={projectData}
            // Sets the columns to the defined above column structure
            columns={projectColumns}
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

export default ClientAndProjects;
