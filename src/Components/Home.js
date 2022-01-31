import axiosInstance from './../Axios.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import './../Styles/Home.css';
import LogHeader from './LogHeader';
import { Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import fetchTagsData from './LoadData/LoadTags';
import fetchLoadLogs from './LoadData/LoadLogs';
import fetchCPData from './LoadData/LoadCPData';

import { useSelector } from 'react-redux';

function Home() {
  const navigate = useNavigate();
  const { DateTime } = require('luxon');

  const tagsData = useSelector((state) => state.tags.value);
  const CPData = useSelector((state) => state.CPData.value);

  const [allLogsLoaded, setAllLogsLoaded] = useState(false);
  const [logData, setLogData] = useState([]);
  const [loadedLogsNumber, setLoadedLogsNumber] = useState(0);
  const [isCPDataLoading, setIsCPDataLoading] = useState(true);
  const [isTagsDataLoading, setIsTagsDataLoading] = useState(true);
  const [isLogDataLoading, setIsLogDataLoading] = useState(true);

  const columns = [
    {
      field: 'date',
      headerName: 'date',
      width: 90,
      type: 'date',
      valueGetter: (params) =>
        DateTime.fromFormat(params.row.date, 'yyyy-LL-dd').toFormat(
          'dd/LL/yyyy'
        ),
    },
    {
      field: 'client/project',
      headerName: 'client/project',
      width: 90,
      valueGetter: (params) =>
        params.row.client
          ? CPData.find(
              (data) => data.id == params.row.client && data.type == 'clients'
            ).name
          : CPData.find(
              (data) => data.id == params.row.project && data.type == 'projects'
            ).name,
    },
    { field: 'time', headerName: 'duration', width: 90, type: 'number' },
    { field: 'description', headerName: 'description', width: 180 },
    {
      field: 'tags',
      headerName: 'tags',
      width: 90,
      valueGetter: (params) => {
        var tags = [];
        for (const tag of params.row.tags) {
          tags.push(tagsData.find((data) => data.id == tag).name.toString());
        }
        return tags.join(', ');
      },
    },
    {
      field: 'edit',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => {
            handleLogDelete(params.row.id);
          }}
          label='Delete'
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => {
            handleLogEdit(params.row.id);
          }}
          label='Edit'
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchLoadLogs(
      loadedLogsNumber,
      setLogData,
      logData,
      setAllLogsLoaded,
      setIsLogDataLoading
    );
  }, [setLogData, loadedLogsNumber]);

  useEffect(() => {
    if (CPData.length == 0) {
      fetchCPData(setIsCPDataLoading);
    } else {
      setIsCPDataLoading(false);
    };
  }, []);

  useEffect(() => {
    if (tagsData.length == 0) {
      fetchTagsData(setIsTagsDataLoading);
    } else {
      setIsTagsDataLoading(false);
    };
  }, []);

  function loadMore(event) {
    event.preventDefault();
    setLoadedLogsNumber(loadedLogsNumber + 50);
  }

  function handleNewLog(data) {
    setLogData([data, ...logData]);
  }

  function handleLogDelete(id) {
    const url = '/CRUD/logs/' + id + '/';
    axiosInstance.delete(url);
    setLogData(
      logData.filter((log) => {
        return log.id != id;
      })
    );
  }

  function handleLogEdit(id) {
    navigate('/edit/' + id);
  }

  console.log(tagsData);

  if (!isCPDataLoading && !isTagsDataLoading && !isLogDataLoading) {
    return (
      <div>
        <LogHeader addLog={handleNewLog} />
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={logData}
            columns={columns}
            sortModel={[
              {
                field: 'date',
                sort: 'desc',
              },
            ]}
            pageSize={100}
            rowsPerPageOptions={[100]}
          />
        </div>
        <Button variant='outlined' onClick={loadMore} disabled={allLogsLoaded}>
          Load More
        </Button>
      </div>
    );
  } else {
    return <Skeleton />;
  }
}

export default Home;
