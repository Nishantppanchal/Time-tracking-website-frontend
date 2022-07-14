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

function Report(props) {
  const { reportData, theme, CPData } = props;
  const hoursPieColours = ['#92e492', 'red'];

  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        xs={12}
        direction='column'
        rowSpacing={3}
        columnSpacing={1}
        id='selectedData'
        key='test111'
      >
        <Grid container item spacing={1} id='clients'>
          <Grid item xs={12}>
            <Typography
              variant='body1'
              fontWeight='bold'
            >
              CLIENTS
            </Typography>
          </Grid>
          {reportData.report.CPTimes.filter((CP) => CP.type === 'clients')
            .length !== 0 ? (
            reportData.report.CPTimes.map((CP) =>
              CP.type === 'clients' ? (
                <Grid item xs='auto' key={CP.id}>
                  <span
                    style={{
                      backgroundColor: theme.palette.secondary.light,
                      color: theme.palette.text.primary,
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
            <Typography variant='body1' fontWeight='bold'>
              PROJECTS
            </Typography>
          </Grid>
          {reportData.report.CPTimes.filter((CP) => CP.type === 'projects')
            .length !== 0 ? (
            reportData.report.CPTimes.map((CP) =>
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
        <Grid container item spacing={1} id='tags'>
          <Grid item xs={12}>
            <Typography variant='body1' key='title' fontWeight='bold'>
              TAGS
            </Typography>
          </Grid>
          {reportData.report.tagTimes.length !== 0 ? (
            reportData.report.tagTimes.map((tag) => (
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
              minutes: reportData.report.totalTime,
            }).toFormat("hh'h' mm'm'")}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} id='barChart'>
        <ResponsiveContainer width='100%' height={340}>
          <BarChart
            data={reportData.timeProgress}
            margin={{ top: 5, right: 40, left: 40, bottom: 30 }}
          >
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
              <Pie
                data={reportData.report.CPTimes}
                dataKey='time'
                cx='50%'
                cy='50%'
                outerRadius='70%'
                stroke={theme.palette.background.default}
              >
                {reportData.report.CPTimes.map((CP, index) => (
                  <Cell key={index} fill={reportData.CPPieColours[index]} />
                ))}
              </Pie>
              <Legend verticalAlign='bottom' iconType='circle' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}>
          <ResponsiveContainer width='100%' aspect={1.7}>
            <PieChart>
              <Pie
                data={reportData.billableArray}
                dataKey='number'
                cx='50%'
                cy='50%'
                outerRadius='70%'
                stroke={theme.palette.background.default}
              >
                {reportData.billableArray.map((CP, index) => (
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
          <Typography
            id='billableLogsTitle'
            sx={{ color: hoursPieColours[0], fontWeight: 'bold' }}
          >
            BILLABLE LOGS
          </Typography>
          <div id='billableLogsLister'>
            <LogsLister
              logs={reportData.report.logs.filter((log) => log.billable)}
              CPData={CPData}
              edit={false}
            />
          </div>
          <Typography
            id='unbillableLogsTitle'
            sx={{ color: hoursPieColours[1], fontWeight: 'bold' }}
          >
            UNBILLABLE LOGS
          </Typography>
          <div id='unbillableLogsLister'>
            <LogsLister
              logs={reportData.report.logs.filter((log) => !log.billable)}
              CPData={CPData}
              edit={false}
            />
          </div>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Report;
