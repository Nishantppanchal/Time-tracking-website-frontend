/* eslint-disable react-hooks/exhaustive-deps */
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import Header from './Header';

import { useState, useEffect } from 'react';

import { Paper, Skeleton, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CircularProgress from '@mui/material/CircularProgress';

import { Duration } from 'luxon';
import { DateTime } from 'luxon';

import axiosInstance from '../Axios';

import fetchCPData from './LoadData/LoadCPData';
import fetchTagsData from './LoadData/LoadTags';
// Import redux components
import { useSelector } from 'react-redux';

function Reports() {
  // Stores tags
  const tagsData = useSelector((state) => state.tags.value);
  // Stores clients and projects data
  const CPData = useSelector((state) => state.CPData.value);
  // Stores the client or project selected
  const [CPSelected, setCPSelected] = useState([]);
  // The value inputed by the user in the client and project selection field
  const [CPInputValue, setCPInputValue] = useState('');
  const [tagsSelected, setTagsSelected] = useState([]);
  const [tagsInputValue, setTagsInputValue] = useState('');
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
  const [report, setReport] = useState({
    CPTimes: [],
    logs: [],
    tagTimes: [],
    totalTime: null,
  });
  // These two are seperated as one control the collapse and the other controls the loading animation
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [timeProgress, setTimeProgress] = useState([]);

  // Creates a filter function
  const CPFilter = createFilterOptions();
  // Creates a filter for the tags
  const tagsFilter = createFilterOptions();

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the CPData has not loaded yet
    if (isCPDataLoading === true) {
      // Runs the function that fetches the CPData
      fetchCPData(setIsCPDataLoading);
      // Otherwise, if the CPData has already been loaded
    }
  }, []);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If tags have not loaded yet
    if (isTagsDataLoading) {
      // Runs the function that fetches the tags
      fetchTagsData(setIsTagsDataLoading);
      // Otherwise, if the tags have not already been loaded
    }
  }, []);

  // Handles value (what is output after client/project selected) change
  function handleAutocompleteCPSelectedChange(event, newValue) {
    // Sets the CPSelected state to the new client or project selected
    setCPSelected(newValue);
  }

  // Handles input value (what is the user inputs in the textfield) change
  function handleAutocompleteCPInputValueChange(event, newInputValue) {
    // Sets the inputValue state to the new input value
    setCPInputValue(newInputValue);
  }

  function handleAutocompleteTagsSelectedChange(event, newValue) {
    setTagsSelected(newValue);
  }

  function handleAutocompleteTagsInputValueChange(event, newInputValue) {
    setTagsInputValue(newInputValue);
  }

  async function handleGenerateReport(event) {
    event.preventDefault();
    const clients = [];
    const projects = [];

    for (var i = 0; i < CPSelected.length; i++) {
      const CP = CPSelected[i];
      if (CP.type === 'clients') {
        clients.push(CP);
      } else {
        projects.push(CP);
      }
    }

    setReportLoading(true);

    const data = await axiosInstance
      .post('generateReport/', {
        clients: clients,
        projects: projects,
        tags: tagsSelected,
      })
      .then((response) => {
        setReport(response.data);
        setReportLoading(false);
        setReportGenerated(true);

        return response.data;
      });

    var timeProgressArray = [];
    if (data.logs.length > 0) {
      const startDate = DateTime.fromFormat(data.logs[0].date, 'yyyy-LL-dd');
      const endDate = DateTime.fromFormat(
        data.logs[data.logs.length - 1].date,
        'yyyy-LL-dd'
      );
      const duration = endDate.diff(startDate, ['days']).toObject().days;
      for (let i = 0, j = 0; i <= duration; i++) {
        const date = startDate.plus({ days: i }).toFormat('yyyy-LL-dd');
        if (date === data.logs[j].date) {
          timeProgressArray.push(data.logs[j]);
          j = j + 1;
        } else {
          timeProgressArray.push({
            date: date,
            time: 0,
          });
        }
      }
    }

    setTimeProgress(timeProgressArray);
  }

  function handleNewReport(event) {
    event.preventDefault();

    setCPSelected([]);
    setTagsSelected([]);

    setReportGenerated(false);
  }

  function handleDownloadPDF(event) {
    event.preventDefault();
  }

  if (!isCPDataLoading && !isTagsDataLoading) {
    return (
      <div>
        <Header />
        {/* In is opposite to reportGenerated as when report is not generated (false), then in has to be true */}
        <Collapse in={!reportGenerated}>
          <Paper>
            <Autocomplete
              multiple
              id='CP'
              options={CPData}
              // Set the option selected value in the textfield to client/project's names
              getOptionLabel={(option) => option.name}
              // Group the options by whether they are clients or projects
              groupBy={(option) => option.type}
              // Sets the width to 30%
              sx={{ width: '30%' }}
              // Assigns filterOptions to a function that filter the client and project based on the input          filterOptions={CPFilter}
              filterOptions={CPFilter}
              // Defines what is render as the input field
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='CLIENTS AND PROJECTS'
                  variant='outlined'
                />
              )}
              // Assign handleAutocompleteValueChange to be run on change of client or project selected
              onChange={handleAutocompleteCPSelectedChange}
              // Sets the value of the client or project selected to the CPSelected state
              value={CPSelected}
              // Assign handleAutocompleteInputValueChange to be run on change of input entered by the user
              onInputChange={handleAutocompleteCPInputValueChange}
              // Sets the input value to the state inputValue
              inputValue={CPInputValue}
            />
            <Autocomplete
              multiple
              id='tags'
              options={tagsData}
              getOptionLabel={(option) => option.name}
              sx={{ width: '30%' }}
              filterOptions={tagsFilter}
              renderInput={(params) => (
                <TextField {...params} label='TAGS' variant='outlined' />
              )}
              onChange={handleAutocompleteTagsSelectedChange}
              value={tagsSelected}
              onInputChange={handleAutocompleteTagsInputValueChange}
              inputValue={tagsInputValue}
            />
            <Button
              variant='contained'
              onClick={handleGenerateReport}
              startIcon={
                reportLoading ? <CircularProgress /> : <AddCircleIcon />
              }
            >
              GENERATE
            </Button>
          </Paper>
        </Collapse>
        <Collapse in={reportGenerated}>
          <Paper>
            <Button
              variant='contained'
              startIcon={<CloudDownloadIcon />}
              onClick={handleDownloadPDF}
            >
              PDF
            </Button>
            <Typography>Clients and projects selected:</Typography>
            {CPSelected.map((CP) => {
              return <span>{CP.name}</span>;
            })}
            <Typography>
              {Duration.fromObject({ minutes: report.totalTime }).toFormat(
                "hh 'hours and' mm 'minutes'"
              )}
            </Typography>
            <LineChart width={600} height={300} data={timeProgress}>
              <Line type='monotone' dataKey='time' stroke='#8884d8' />
              <XAxis dataKey='date' />
              <YAxis />
            </LineChart>
            <Button
              variant='contained'
              startIcon={<AddCircleIcon />}
              onClick={handleNewReport}
            >
              NEW REPORT
            </Button>
          </Paper>
        </Collapse>
        {/* <h1>Reports</h1>
        <PieChart width={730} height={250}>
          <Pie
            data={data}
            dataKey='time'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius='100%%'
            fill='#8884d8'
            label={renderCustomizedLabel}
          />
          <Tooltip />
        </PieChart> */}
      </div>
    );
  } else {
    return <Skeleton />;
  }
}

export default Reports;
