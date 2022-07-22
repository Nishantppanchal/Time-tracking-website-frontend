/* eslint-disable react-hooks/exhaustive-deps */

import Header from '../Components/Header';

import { useEffect, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  CssBaseline,
  Grid,
  Paper, TextField,
  Typography,
  Zoom
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Collapse from '@mui/material/Collapse';

import { DateTime, Interval } from 'luxon';

import axiosInstance from '../Axios';

import fetchCPData from '../Components/LoadData/LoadCPData';
import fetchTagsData from '../Components/LoadData/LoadTags';
// Import redux components
import { useDispatch, useSelector } from 'react-redux';
import getTheme from '../Components/GetTheme';

import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import Report from '../Components/Report';
import { clearReportData, editReportData } from '../Features/ReportData';
import ReportsLoading from '../Loading Components/ReportsLoading';

function Reports() {
  const dispatch = useDispatch();

  const animationDuration = 400;
  const theme = getTheme();

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
    ).forEach(() => {
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

    dispatch(clearReportData());
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
          <div style={{ padding: '3rem' }}>
            <Report
              report={report}
              timeProgress={timeProgress}
              billableArray={billableArray}
              CPPieColours={CPPieColours}
              theme={theme}
              CPData={CPData}
              exportPage={false}
              handleNewReport={handleNewReport}
              handleExportReport={handleExportReport}
            />
          </div>
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
