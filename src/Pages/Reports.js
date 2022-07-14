/* eslint-disable react-hooks/exhaustive-deps */
import {
  BarChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Label,
  Tooltip,
  CartesianGrid,
  Bar,
  PieChart,
  Legend,
  Cell,
  Pie,
} from 'recharts';

import Header from '../Components/Header';

import { useState, useEffect, createRef } from 'react';

import {
  CssBaseline,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Typography,
  Zoom,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Duration, Interval } from 'luxon';
import { DateTime } from 'luxon';

import axiosInstance from '../Axios';

import fetchCPData from '../Components/LoadData/LoadCPData';
import fetchTagsData from '../Components/LoadData/LoadTags';
// Import redux components
import { useDispatch, useSelector } from 'react-redux';
import getTheme from '../Components/GetTheme';
import LogsLister from '../Components/LogsLister';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { editReportData, initialValue } from '../Features/ReportData';
import { useNavigate } from 'react-router-dom';
import { toggleMode, toggleToWhite } from '../Features/Mode';
import LoadingButton from '@mui/lab/LoadingButton';
import ReportsLoading from '../Loading Components/ReportsLoading';
import Stack from '@mui/material/Stack';

function Reports() {
  const dispatch = useDispatch();

  const animationDuration = 400;
  const theme = getTheme();

  const hoursPieColours = ['#92e492', 'red'];

  // Stores tags
  const tagsData = useSelector((state) => state.tags.value);
  // Stores clients and projects data
  const CPData = useSelector((state) => state.CPData.value);
  const mode = useSelector((state) => state.mode.value);
  const data = useSelector((state) => state.reportData.value);
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
  const [report, setReport] = useState(data.report);
  // These two are seperated as one control the collapse and the other controls the loading animation
  const [reportGenerated, setReportGenerated] = useState(data.reportGenerated);
  const [inputOpen, setInputOpen] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [timeProgress, setTimeProgress] = useState(data.timeProgress);
  const [CPPieColours, setCPPieColours] = useState(data.CPPieColours);
  const [billableArray, setBillableArray] = useState(data.billableArray);
  const [billableLogsOpen, setBillableLogsOpen] = useState(true);
  const [unbillableLogsOpen, setUnbillableLogsOpen] = useState(true);

  // Creates a filter function
  const CPFilter = createFilterOptions();
  // Creates a filter for the tags
  const tagsFilter = createFilterOptions();

  const navigate = useNavigate();

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the CPData has not loaded yet
    if (isCPDataLoading === true) {
      // Runs the function that fetches the CPData
      fetchCPData(setIsCPDataLoading);
      // Otherwise, if the CPData has already been loaded
    }
    // If tags have not loaded yet
    if (isTagsDataLoading) {
      // Runs the function that fetches the tags
      fetchTagsData(setIsTagsDataLoading);
      // Otherwise, if the tags have not already been loaded
    }
  }, []);

  useEffect(() => {
    if (reportGenerated) {
      setTimeout(() => {
        setInputOpen(false);
      }, animationDuration + 100);
    } else {
      setInputOpen(true);
    }
  }, [reportGenerated]);

  useEffect(() => {
    generateCPPieColours(report);
  }, [mode]);

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

        console.log(response.data);

        return response.data;
      })
      .catch((error) => {
        if (
          error.response.data.detail ===
          'Invalid token header. No credentials provided.'
        ) {
          setReport(error.response.data.requestData.data);
          setReportLoading(false);
          setReportGenerated(true);

          return error.response.data.requestData.data;
        }
      });

    var timeProgressArray = [];
    if (data.logs.length > 0) {
      const startDate = DateTime.fromFormat(data.logs[0].date, 'yyyy-LL-dd');
      const endDate = DateTime.fromFormat(
        data.logs[data.logs.length - 1].date,
        'yyyy-LL-dd'
      );
      const duration = Interval.fromDateTimes(startDate, endDate).length(
        'days'
      );
      var dateTimeObj = {};
      for (let i = 0; i <= duration; i++) {
        const date = startDate.plus({ days: i }).toFormat('yyyy-LL-dd');
        dateTimeObj[date] = 0;
      }
      data.logs.forEach((log) => {
        dateTimeObj[log.date] += log.time;
      });
      const entries = Object.entries(dateTimeObj);
      entries.forEach((entry) => {
        timeProgressArray.push({
          date: entry[0],
          time: entry[1],
        });
      });
    }

    setTimeProgress(timeProgressArray);

    var tempBillableArray = [
      { name: 'Billable', number: 0 },
      { name: 'Unbillable', number: 0 },
    ];
    data.logs.forEach((log) => {
      if (log.billable === true) {
        tempBillableArray[0].number += 1;
      } else {
        tempBillableArray[1].number += 1;
      }
    });

    setBillableArray(tempBillableArray);

    const coloursArray = generateCPPieColours(data);
    setCPPieColours(coloursArray);

    const theme = getTheme();
    dispatch(
      editReportData({
        oldTheme: theme,
        report: data,
        timeProgress: timeProgressArray,
        billableArray: tempBillableArray,
        CPPieColours: coloursArray,
        reportGenerated: true,
      })
    );
  }

  function generateCPPieColours(report) {
    var CPcolorArray = [];
    (report.CPTimes.length >= report.tagTimes.length
      ? report.CPTimes
      : report.tagTimes
    ).forEach((CP) => {
      const randomColour = generateRandomColour(CPcolorArray);
      CPcolorArray.push(randomColour);
    });

    const [min, max] = theme.palette.mode === 'light' ? [20, 50] : [50, 80];

    CPcolorArray = CPcolorArray.map(
      (colour) =>
        'hsl(' + colour + ', 60%, ' + generateRandomNumber(min, max) + '%)'
    );
    setCPPieColours(CPcolorArray);
    return CPcolorArray;
  }

  function generateRandomColour(CPcolorArray) {
    var randomColor = generateRandomNumber(360, 1);
    if (
      CPcolorArray.find(
        (colour) => colour >= randomColor - 150 && colour <= randomColor + 150
      )
    ) {
      return generateRandomColour(CPcolorArray);
    } else {
      return randomColor;
    }
  }

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function handleNewReport(event) {
    event.preventDefault();

    setCPSelected([]);
    setTagsSelected([]);

    setReportGenerated(false);

    dispatch(editReportData(initialValue));
  }

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ padding: '10px' }}>
          <Typography align='center' fontWeight='bold'>
            DATE
          </Typography>
          <Typography>{`${label}`}</Typography>
          <Typography>{`TIME:  ${payload[0].value}`}</Typography>
        </Paper>
      );
    }

    return null;
  }

  function handleToggleBillable() {
    setBillableLogsOpen(!billableLogsOpen);
  }

  function handleToggleUnbillable() {
    setUnbillableLogsOpen(!unbillableLogsOpen);
  }

  function handleExportReport() {
    const theme = getTheme();
    dispatch(
      editReportData({
        oldTheme: theme,
        report: report,
        timeProgress: timeProgress,
        billableArray: billableArray,
        CPPieColours: CPPieColours,
        reportGenerated: true,
      })
    );
    navigate('/report-export');
  }

  if (!isCPDataLoading && !isTagsDataLoading) {
    return (
      <>
        <CssBaseline />
        <Header page='reports' />
        {/* In is opposite to reportGenerated as when report is not generated (false), then in has to be true */}
        <Collapse in={inputOpen} timeout={animationDuration}>
          <Zoom
            in={!reportGenerated}
            timeout={animationDuration}
            style={{
              transitionDelay: !reportGenerated
                ? String(animationDuration + 100) + 'ms'
                : '0ms',
            }}
          >
            <Paper
              sx={{
                margin: '1rem 1rem 0rem',
                padding: '1rem',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6' width='100%' align='center'>
                    GENERATE REPORT
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id='CP'
                    options={CPData}
                    // Set the option selected value in the textfield to client/project's names
                    getOptionLabel={(option) => option.name}
                    // Group the options by whether they are clients or projects
                    groupBy={(option) => option.type}
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
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id='tags'
                    options={tagsData}
                    getOptionLabel={(option) => option.name}
                    filterOptions={tagsFilter}
                    renderInput={(params) => (
                      <TextField {...params} label='TAGS' variant='outlined' />
                    )}
                    onChange={handleAutocompleteTagsSelectedChange}
                    value={tagsSelected}
                    onInputChange={handleAutocompleteTagsInputValueChange}
                    inputValue={tagsInputValue}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'end',
                    }}
                  >
                    <LoadingButton
                      loading={reportLoading}
                      variant='contained'
                      onClick={handleGenerateReport}
                      startIcon={<AddCircleIcon />}
                    >
                      GENERATE
                    </LoadingButton>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        </Collapse>
        <Collapse in={reportGenerated}>
          <Grid container spacing={3} padding='3rem' justifyContent='center'>
            <Grid item xs={12}>
              <Typography variant='h4' width='100%' align='center'>
                REPORT
              </Typography>
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={12}>
                <Typography variant='body1' key='title' fontWeight='bold'>
                  CLIENTS
                </Typography>
              </Grid>
              {report.CPTimes.filter((CP) => CP.type === 'clients').length !==
              0 ? (
                report.CPTimes.map((CP) =>
                  CP.type === 'clients' ? (
                    <Grid item xs='auto' key={CP.id}>
                      <span
                        style={{
                          backgroundColor: theme.palette.secondary.light,
                          color: theme.palette.text.primary,
                          borderRadius: '4px',
                          padding: '5px',
                        }}
                      >
                        {CP.name}
                      </span>
                    </Grid>
                  ) : null
                )
              ) : (
                <Grid item xs='auto'>
                  <Typography variant='body1' fontStyle='italic'>
                    No clients selected
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={12}>
                <Typography variant='body1' key='title' fontWeight='bold'>
                  PROJECTS
                </Typography>
              </Grid>
              {report.CPTimes.filter((CP) => CP.type === 'projects').length !==
              0 ? (
                report.CPTimes.map((CP) =>
                  CP.type === 'projects' ? (
                    <Grid item xs='auto' key={CP.id}>
                      <span
                        style={{
                          backgroundColor: theme.palette.secondary.light,
                          color: theme.palette.text.primary,
                          borderRadius: '4px',
                          padding: '5px',
                        }}
                      >
                        {CP.name}
                      </span>
                    </Grid>
                  ) : null
                )
              ) : (
                <Grid item xs='auto'>
                  <Typography variant='body1' fontStyle='italic'>
                    No projects selected
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={12}>
                <Typography variant='body1' key='title' fontWeight='bold'>
                  TAGS
                </Typography>
              </Grid>
              {report.tagTimes.length !== 0 ? (
                report.tagTimes.map((tag) => (
                  <Grid item xs='auto' key={tag.id}>
                    <span
                      style={{
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.text.primary,
                        borderRadius: '4px',
                        padding: '5px',
                      }}
                    >
                      {tag.name}
                    </span>
                  </Grid>
                ))
              ) : (
                <Grid item xs='auto'>
                  <Typography variant='body1' fontStyle='italic'>
                    No tags selected
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid container item direction='column' spacing={1}>
              <Grid item>
                <Typography variant='body1' fontWeight='bold'>
                  TIME LOGGED
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='h4'>
                  {Duration.fromObject({
                    minutes: report.totalTime,
                  }).toFormat("hh'h' mm'm'")}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ResponsiveContainer width='100%' height={340}>
                <BarChart
                  data={timeProgress}
                  margin={{ top: 5, right: 40, left: 40, bottom: 30 }}
                >
                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Bar
                    barSize={20}
                    dataKey='time'
                    fill={theme.palette.primary.main}
                  />
                  <XAxis dataKey='date' stroke={theme.palette.text.primary}>
                    <Label
                      value='DATE'
                      offset={-15}
                      position='insideBottom'
                      fill={theme.palette.text.primary}
                    />
                  </XAxis>
                  <YAxis stroke={theme.palette.text.primary}>
                    <Label
                      value='MINUTES'
                      offset={-5}
                      angle={-90}
                      position='insideLeft'
                      fill={theme.palette.text.primary}
                    />
                  </YAxis>
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item container xs={12} spacing={0}>
              <Grid item xs={6}>
                <Typography variant='body1' fontWeight='bold'>
                  CLIENTS AND PROJECTS BREAKDOWN
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body1' fontWeight='bold'>
                  HOURS BREAKDOWN
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ResponsiveContainer width='100%' aspect={1.7}>
                  <PieChart>
                    <Pie
                      data={report.CPTimes}
                      dataKey='time'
                      cx='50%'
                      cy='50%'
                      outerRadius='90%'
                      stroke={theme.palette.background.default}
                    >
                      {report.CPTimes.map((CP, index) => (
                        <Cell key={index} fill={CPPieColours[index]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign='bottom'
                      iconType='circle'
                      height={36}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={6}>
                <ResponsiveContainer width='100%' aspect={1.7}>
                  <PieChart>
                    <Pie
                      data={billableArray}
                      dataKey='number'
                      cx='50%'
                      cy='50%'
                      outerRadius='90%'
                      stroke={theme.palette.background.default}
                    >
                      {billableArray.map((CP, index) => (
                        <Cell key={index} fill={hoursPieColours[index]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign='bottom'
                      iconType='circle'
                      height={36}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Stack direction='column' spacing={1}>
                <Typography variant='body1' fontWeight='bold'>
                  LOGS
                </Typography>
                <div>
                  <Button
                    sx={{ color: hoursPieColours[0], fontWeight: 'bold' }}
                    onClick={handleToggleBillable}
                    startIcon={
                      billableLogsOpen ? <ArrowUpIcon /> : <ArrowDownIcon />
                    }
                  >
                    BILLABLE LOGS
                  </Button>
                </div>
                <Collapse in={billableLogsOpen}>
                  <LogsLister
                    logs={report.logs.filter((log) => log.billable)}
                    CPData={CPData}
                    edit={false}
                  />
                </Collapse>
                <div>
                  <Button
                    sx={{ color: hoursPieColours[1], fontWeight: 'bold' }}
                    onClick={handleToggleUnbillable}
                    startIcon={
                      unbillableLogsOpen ? <ArrowUpIcon /> : <ArrowDownIcon />
                    }
                  >
                    UNBILLABLE LOGS
                  </Button>
                </div>
                <Collapse in={unbillableLogsOpen}>
                  <LogsLister
                    logs={report.logs.filter((log) => !log.billable)}
                    CPData={CPData}
                    edit={false}
                  />
                </Collapse>
              </Stack>
            </Grid>
            <Grid
              item
              container
              direction='row'
              justifyContent='flex-end'
              spacing={3}
            >
              <Grid item>
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon />}
                  onClick={handleExportReport}
                >
                  EXPORT
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='contained'
                  startIcon={<AddCircleIcon />}
                  onClick={handleNewReport}
                >
                  NEW REPORT
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Collapse>
      </>
    );
  } else {
    return (
      <>
        <CssBaseline />
        <Header page='reports' />
        <ReportsLoading />
      </>
    );
  }
}

export default Reports;
