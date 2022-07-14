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
import CPListerLoading from './CPListerLoading';

function ClientsAndProjectsLoading() {
    return (
        <>
          <CssBaseline />
          <Header page='clients and projects' />
          <Grid container spacing={2} justifyContent='center' alignItems='flex-start' margin='1rem'>
            <Grid item xs={6}>
              <Typography variant='h6' width='100%' align='center'>Clients</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h6' width='100%' align='center'>Projects</Typography>
            </Grid>
            <Grid item xs={6}>
              <CPListerLoading />
            </Grid>
            <Grid item xs={6}>
              <CPListerLoading />
            </Grid>
          </Grid>
        </>
      );
}

export default ClientsAndProjectsLoading;