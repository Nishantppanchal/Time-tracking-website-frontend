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

function Home() {
  const navigate = useNavigate();
  const { DateTime } = require('luxon');

  const [CPData, setCPData] = useState([]);
  const [tagsData, setTagsData] = useState([]);
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
          tags.push(
            tagsData.find((data) => data.id == tag).name.toString()
          );
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
    axiosInstance
      .get('CRUD/logs/', { params: { number: loadedLogsNumber } })
      .then((response) => {
        console.log(response.data);
        if (response.data.length > 0) {
          setLogData([...new Set([...logData, ...response.data])]);
        } else {
          setAllLogsLoaded(true); //To disable the load more button
        }
        setIsLogDataLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
        if (
          error.response.data.detail ==
          'Invalid token header. No credentials provided.'
        ) {
          if (error.response.data.requestData.data.length > 0) {
            setLogData([
              ...new Set([...logData, ...error.response.data.requestData.data]),
            ]);
          } else {
            setAllLogsLoaded(true);
          }
          setIsLogDataLoading(false);
        }
      });
  }, [setLogData, loadedLogsNumber]);

  useEffect(() => {
    axiosInstance
      .get('clientProjectGet/')
      .then((response) => {
        setCPData([...response.data]);
        setIsCPDataLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response.data.detail ==
          'Invalid token header. No credentials provided.'
        ) {
          setCPData([...error.response.data.requestData.data]);
          setIsCPDataLoading(false);
        }
      });
  }, [setCPData]);

  useEffect(() => {
    axiosInstance
      .get('CRUD/tags/')
      .then((response) => {
        console.log(process.env.REACT_APP_CLIENTID);
        setTagsData([...response.data]);
        setIsTagsDataLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response.data.detail ==
          'Invalid token header. No credentials provided.'
        ) {
          setTagsData([...error.response.data.requestData.data]);
          setIsTagsDataLoading(false);
        }
      });
  }, [setTagsData]);

  function loadMore(event) {
    event.preventDefault();

    setLoadedLogsNumber(loadedLogsNumber + 50);
  }

  function handleNewLog(data) {
    setLogData([data, ...logData]);
  }

  function handleAddCP(data) {
    setCPData([data, ...CPData]);
  }

  async function handleAddTag(data) {
    console.log(tagsData);
    console.log(data);
    await setTagsData([...data, ...tagsData]);
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
        <LogHeader
          CPData={CPData}
          tagsData={tagsData}
          addLog={handleNewLog}
          addCP={handleAddCP}
          addTag={handleAddTag}
        />
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
    return (
      <div>
        <LogHeader
          CPData={CPData}
          tagsData={tagsData}
          addLog={handleNewLog}
          addCP={handleAddCP}
          addTag={() => {
            return null;
          }}
        />
        <Skeleton />
      </div>
    );
  }
}

export default Home;
