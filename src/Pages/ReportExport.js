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

function ReportExport() {
  // const theme = getTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [generatingReport, setGeneratingReport] = useState(false);

  const hoursPieColours = ['#92e492', 'red'];

  const reportData = useSelector((state) => state.reportData.value);
  // Stores clients and projects data
  const CPData = useSelector((state) => state.CPData.value);

  const mode = useSelector((state) => state.mode.value);

  const history = createBrowserHistory();

  const theme = useMemo(() => {
    return createTheme(getThemeDict('light'));
  });

  history.listen(({ location, action }) => {
    if (action === 'POP') {
      navigate('/reports', { replace: true });
    }
  });

  useEffect(() => {
    if (Object.keys(reportData.oldTheme).length === 0) {
      navigate('/reports', { replace: true });
    }
  }, []);

  function getOffsetLeft(...elements) {
    var sum = 0;
    for (let element of elements) {
      const paddingStr = window
        .getComputedStyle(element)
        .getPropertyValue('padding-left');
      const marginStr = window
        .getComputedStyle(element)
        .getPropertyValue('margin-left');
      const offsetInt =
        parseInt(paddingStr.slice(0, -2)) + parseInt(marginStr.slice(0, -2));
      sum += offsetInt;
    }

    return sum;
  }

  async function handleDownloadPDF() {
    setGeneratingReport(true);

    var pdf = new jsPDF('p', 'px', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const selectedData = document.getElementById('selectedData');
    const totalTime = document.getElementById('totalTime');
    const barChart = document.getElementById('barChart');
    const pieCharts = document.getElementById('pieCharts');

    const logsContainerOffset = getOffsetLeft(
      document.getElementById('logsContainer')
    );

    const logsTitle = document.getElementById('logsTitle');

    const billableLogsTitle = document.getElementById('billableLogsTitle');
    const billableLogsLister =
      document.getElementById('billableLogsLister').children[0];
    const billableHeader = billableLogsLister.children[0].children[0];
    const billableLogs = billableLogsLister.children[0].children[1].children;

    const unbillableLogsTitle = document.getElementById('unbillableLogsTitle');
    const unbillableLogsLister = document.getElementById('unbillableLogsLister')
      .children[0];
    const unbillableHeader = unbillableLogsLister.children[0].children[0];
    const unbillableLogs =
      unbillableLogsLister.children[0].children[1].children;

    const logsTitleOffset = logsContainerOffset;
    const logsListerOffset =
      logsContainerOffset +
      getOffsetLeft(
        document.getElementById('billableLogsLister'),
        billableLogsLister
      );
    const headerOffset =
      logsListerOffset + getOffsetLeft(billableLogsLister.children[0]);
    const logsOffset =
      billableLogs.length === 0
        ? 0
        : logsListerOffset +
          getOffsetLeft(
            billableLogsLister.children[0],
            billableLogsLister.children[0].children[1]
          );

    const billableLogsArray = Array.from(billableLogs).map((log) => ({
      component: log,
      offset: logsOffset,
      marginRight: logsOffset,
    }));
    const unbillableLogsArray = Array.from(unbillableLogs).map((log) => ({
      component: log,
      offset: logsOffset,
      marginRight: logsOffset,
    }));

    const componentsArray = [
      { component: selectedData, offset: 0 },
      { component: totalTime, offset: 0 },
      { component: barChart, offset: 0 },
      { component: pieCharts, offset: 0 },
      { component: logsTitle, offset: logsTitleOffset },
      { component: billableLogsTitle, offset: logsTitleOffset },
      { component: billableHeader, offset: headerOffset, marginRight: logsOffset, },
      ...billableLogsArray,
      { component: unbillableLogsTitle, offset: logsTitleOffset },
      { component: unbillableHeader, offset: headerOffset, marginRight: logsOffset, },
      ...unbillableLogsArray,
    ];

    pdf = await insertIntoPDF(componentsArray, 0, pdf, pageWidth, pageHeight);

    setGeneratingReport(false);
    pdf.save('report.pdf');
  }

  async function insertIntoPDF(
    components,
    trackLocation,
    pdf,
    pageWidth,
    pageHeight
  ) {
    var component = components[0].component;
    var offset = components[0].offset;
    var marginRight = components[0].marginRight ?? 0;
    await await html2canvas(component, { scale: 3 }).then((canvas) => {
      const width = component.offsetWidth;
      const height = component.offsetHeight;
      const imgData = canvas.toDataURL('image/png');
      const scalingFactor = (pageWidth - offset - marginRight) / width;
      const scaledHeight = Math.ceil(height * scalingFactor);

      if (trackLocation + scaledHeight > pageHeight - 30) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          'JPEG',
          offset,
          30,
          pageWidth - offset - marginRight,
          scaledHeight
        );
        trackLocation = scaledHeight + 30;
      } else {
        pdf.addImage(
          imgData,
          'JPEG',
          offset,
          trackLocation,
          pageWidth - offset - marginRight,
          scaledHeight
        );
        trackLocation += scaledHeight;
      }
    });

    components.shift();
    if (components.length > 0) {
      return insertIntoPDF(
        components,
        trackLocation,
        pdf,
        pageWidth,
        pageHeight
      );
    } else {
      return pdf;
    }
  }

  function handleCancel() {
    dispatch(restoreMode());
    navigate('/reports');
  }

  if (Object.keys(reportData.oldTheme).length > 0) {
    return (
      <>
        <CssBaseline />
        <Grid
          container
          spacing={3}
          sx={{
            padding: '1rem',
            bgcolor: reportData.oldTheme.palette.background.default,
            height: '100%',
          }}
        >
          <Grid item xs={12} height='calc(100vh - 77px)'>
            <Paper
              sx={{
                overflow: 'auto',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: 'none',
                '&::after': {
                  content: '""',
                  position: 'fixed',
                  left: '1rem',
                  right: '1rem',
                  height: 'calc(100vh - 80px - 1.5rem)',
                  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
                  borderRadius: '4px',
                },
              }}
            >
              <ThemeProvider theme={theme}>
                {/* To fix the loadingbutton lag problem, make sub component */}
                <div
                  style={{
                    backgroundColor: 'white',
                    width: '210mm',
                    position: 'relative',
                    height: 'max-content',
                    margin: '1rem 0rem',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    padding: '2rem',
                  }}
                  id='doc'
                >
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
                      <Grid container item spacing={1} id='clients'>
                        <Grid item xs={12}>
                          <Typography
                            variant='body1'
                            key='title'
                            fontWeight='bold'
                          >
                            CLIENTS
                          </Typography>
                        </Grid>
                        {reportData.report.CPTimes.filter(
                          (CP) => CP.type === 'clients'
                        ).length !== 0 ? (
                          reportData.report.CPTimes.map((CP) =>
                            CP.type === 'clients' ? (
                              <Grid item xs='auto' key={CP.id}>
                                <span
                                  style={{
                                    backgroundColor:
                                      theme.palette.secondary.light,
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
                          <Typography
                            variant='body1'
                            key='title'
                            fontWeight='bold'
                          >
                            PROJECTS
                          </Typography>
                        </Grid>
                        {reportData.report.CPTimes.filter(
                          (CP) => CP.type === 'projects'
                        ).length !== 0 ? (
                          reportData.report.CPTimes.map((CP) =>
                            CP.type === 'projects' ? (
                              <Grid item xs='auto' key={CP.id}>
                                <span
                                  style={{
                                    backgroundColor:
                                      theme.palette.secondary.light,
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
                          <Typography
                            variant='body1'
                            fontWeight='bold'
                          >
                            TAGS
                          </Typography>
                        </Grid>
                        {reportData.report.tagTimes.length !== 0 ? (
                          reportData.report.tagTimes.map((tag) => (
                            <Grid item xs='auto' key={tag.id}>
                              <span
                                style={{
                                  backgroundColor:
                                    theme.palette.secondary.light,
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
                    <Grid
                      container
                      item
                      direction='column'
                      spacing={1}
                      id='totalTime'
                    >
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
                          <XAxis
                            dataKey='date'
                            stroke={theme.palette.text.primary}
                          >
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
                        <Typography
                          variant='body1'
                          fontWeight='bold'
                          id='hourBreakdown'
                        >
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
                                <Cell
                                  key={index}
                                  fill={reportData.CPPieColours[index]}
                                />
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
                              data={reportData.billableArray}
                              dataKey='number'
                              cx='50%'
                              cy='50%'
                              outerRadius='70%'
                              stroke={theme.palette.background.default}
                            >
                              {reportData.billableArray.map((CP, index) => (
                                <Cell
                                  key={index}
                                  fill={hoursPieColours[index]}
                                />
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
                    <Grid item xs={12} id='logsContainer'>
                      <Stack direction='column' spacing={1}>
                        <Typography
                          variant='body1'
                          id='logsTitle'
                          fontWeight='bold'
                        >
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
                            logs={reportData.report.logs.filter(
                              (log) => log.billable
                            )}
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
                            logs={reportData.report.logs.filter(
                              (log) => !log.billable
                            )}
                            CPData={CPData}
                            edit={false}
                          />
                        </div>
                      </Stack>
                    </Grid>
                  </Grid>
                </div>
              </ThemeProvider>
            </Paper>
          </Grid>
          <Grid
            item
            xs
            style={{ display: 'flex', justifyContent: 'flex-start' }}
            id='button'
          >
            <Button variant='contained' onClick={handleCancel}>
              BACK
            </Button>
          </Grid>
          <Grid item xs='auto'>
            <LoadingButton
              loading={generatingReport}
              variant='contained'
              onClick={handleDownloadPDF}
              startIcon={<PdfIcon />}
            >
              DOWNLOAD PDF
            </LoadingButton>
          </Grid>
          <Grid item xs='auto'>
            <LoadingButton
              loading={generatingReport}
              variant='contained'
              onClick={handleDownloadPDF}
              startIcon={<ImageIcon />}
            >
              DOWNLOAD IMAGE
            </LoadingButton>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return null;
  }
}

export default ReportExport;
