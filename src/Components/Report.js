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
import LoadingButton from '@mui/lab/LoadingButton';

import { useState, useEffect, useMemo } from 'react';

import {
  createTheme,
  CssBaseline,
  Grid,
  Paper,
  Skeleton,
  TextField,
  ThemeProvider,
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
import ImageIcon from '@mui/icons-material/Image';

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

import PdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';
import { restoreMode, toggleToWhite } from '../Features/Mode';
import { padding } from '@mui/system';

import Stack from '@mui/material/Stack';

import { createBrowserHistory } from 'history';
import { getThemeDict } from '../App';

const hoursPieColours = ['#92e492', 'red'];

function Report(props) {
  const {
    report,
    timeProgress,
    billableArray,
    CPPieColours,
    theme,
    CPData,
    exportPage,
  } = props;

  const [billableLogsOpen, setBillableLogsOpen] = useState(true);
  const [unbillableLogsOpen, setUnbillableLogsOpen] = useState(true);

  const handleNewReport = props.handleNewReport ?? (() => {});
  const handleExportReport = props.handleExportReport ?? (() => {});

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ padding: '10px' }}>
          {label === undefined ? (
            <Typography align='center' fontWeight='bold'>
              {payload[0].name}
            </Typography>
          ) : (
            <Typography align='center' fontWeight='bold'>
              {label}
            </Typography>
          )}

          <Typography align='center'>
            {Duration.fromObject({
              minutes: payload[0].value,
            }).toFormat("hh'h' mm'm'")}
          </Typography>
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

  return (
    <Grid container spacing={3} color='text.primary'>
      <Grid
        container
        item
        xs={12}
        direction='column'
        rowSpacing={3}
        columnSpacing={1}
        id='selectedData'
      >
        <Grid item>
          <Typography variant='h4' width='100%' align='center'>
            REPORT
          </Typography>
        </Grid>
        <Grid container item spacing={1} id='clients'>
          <Grid item xs={12}>
            <Typography variant='body1' key='title' fontWeight='bold'>
              CLIENTS
            </Typography>
          </Grid>
          {report.CPTimes.filter((CP) => CP.type === 'clients').length !== 0 ? (
            report.CPTimes.map((CP) =>
              CP.type === 'clients' ? (
                <Grid item xs='auto' key={CP.id}>
                  <span
                    style={{
                      backgroundColor: theme.palette.secondary.light,
                      color: theme.palette.secondary.main,
                      borderRadius: '4px',
                      padding: '5px',
                      fontFamily: 'Roboto, san-serif',
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
        <Grid container item spacing={1} id='projects'>
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
                      color: theme.palette.secondary.main,
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
        <Grid container item spacing={1} id='tags'>
          <Grid item xs={12}>
            <Typography variant='body1' fontWeight='bold'>
              TAGS
            </Typography>
          </Grid>
          {report.tagTimes.length !== 0 ? (
            report.tagTimes.map((tag) => (
              <Grid item xs='auto' key={tag.id}>
                <span
                  style={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.main,
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
      </Grid>
      <Grid container item direction='column' spacing={1} id='totalTime'>
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
      <Grid item xs={12} id='barChart'>
        <ResponsiveContainer width='100%' height={340}>
          <BarChart
            data={timeProgress}
            margin={{ top: 5, right: 40, left: 40, bottom: 30 }}
          >
            {!exportPage && <Tooltip content={<CustomTooltip />} />}
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
      <Grid container item xs={12} spacing={1} id='pieCharts'>
        <Grid item xs={6}>
          <Typography variant='body1' fontWeight='bold'>
            CLIENTS AND PROJECTS BREAKDOWN
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body1' fontWeight='bold' id='hourBreakdown'>
            HOURS BREAKDOWN
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <ResponsiveContainer width='100%' aspect={1.7}>
            <PieChart>
              {!exportPage && <Tooltip content={<CustomTooltip />} />}
              <Pie
                data={report.CPTimes}
                dataKey='time'
                cx='50%'
                cy='50%'
                outerRadius='70%'
                stroke={theme.palette.background.default}
              >
                {report.CPTimes.map((CP, index) => (
                  <Cell key={index} fill={CPPieColours[index]} />
                ))}
              </Pie>
              <Legend verticalAlign='bottom' iconType='circle' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}>
          <ResponsiveContainer width='100%' aspect={1.7}>
            <PieChart>
              {!exportPage && <Tooltip content={<CustomTooltip />} />}
              <Pie
                data={billableArray}
                dataKey='number'
                cx='50%'
                cy='50%'
                outerRadius='70%'
                stroke={theme.palette.background.default}
              >
                {billableArray.map((CP, index) => (
                  <Cell key={index} fill={hoursPieColours[index]} />
                ))}
              </Pie>
              <Legend verticalAlign='bottom' iconType='circle' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      <Grid item xs={12} id='logsContainer'>
        <Stack direction='column' spacing={1}>
          <Typography variant='body1' id='logsTitle' fontWeight='bold'>
            LOGS
          </Typography>
          {exportPage ? (
            <Typography
              id='billableLogsTitle'
              sx={{ color: hoursPieColours[0], fontWeight: 'bold' }}
            >
              BILLABLE LOGS
            </Typography>
          ) : (
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
          )}
          <div id='billableLogsLister'>
            <Collapse in={billableLogsOpen}>
              <LogsLister
                logs={report.logs.filter((log) => log.billable)}
                CPData={CPData}
                edit={false}
              />
            </Collapse>
          </div>
          {exportPage ? (
            <Typography
              id='unbillableLogsTitle'
              sx={{ color: hoursPieColours[1], fontWeight: 'bold' }}
            >
              UNBILLABLE LOGS
            </Typography>
          ) : (
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
          )}
          <div id='unbillableLogsLister'>
            <Collapse in={unbillableLogsOpen}>
              <LogsLister
                logs={report.logs.filter((log) => !log.billable)}
                CPData={CPData}
                edit={false}
              />
            </Collapse>
          </div>
        </Stack>
      </Grid>
      {!exportPage && (
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
      )}
    </Grid>
  );
}

export default Report;
export { hoursPieColours }