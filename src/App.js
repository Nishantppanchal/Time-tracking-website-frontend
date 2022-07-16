// Import React components
import React, { Suspense, lazy, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
// Import custom components
import RequireAuth from './Components/RequireAuth';
import Entry from './Pages/Entry';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import DashboardLoading from './Loading Components/DashboardLoading';
import LogsLoading from './Loading Components/LogsLoading';
import ClientsAndProjectsLoading from './Loading Components/ClientsAndProjectsLoading';
import ReportPDF from './Pages/ReportExport';

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from './Features/Theme';

import themeParser from './Components/ThemeToCSS';

const Dashboard = lazy(() => import('./Pages/Dashboard'));
const LogsEditPage = lazy(() => import('./Pages/EditLogs'));
const Reports = lazy(() => import('./Pages/Reports.js'));
const Logs = lazy(() => import('./Pages/Logs'));
const ClientAndProjects = lazy(() => import('./Pages/ClientsAndProjects'));
const CPEditPage = lazy(() => import('./Pages/EditCP'));

function getThemeDict(mode) {
  var theme = {
    palette: {
      //Dark or light theme
      mode: mode,
      // Secondary color
      secondary: {
        // main: '#F79256',
        main: '#e87c17',
        light: '#fae2cc',
      },
      // Password visible on colour
      visiblity: {
        main: '#81c784',
      },
      // Password visible off colour
      visibilityOff: {
        main: '#b4b2b2',
      },
      divider: {
        main: 'black',
      },
    },
    // Edits the typography component styles
    typography: {
      // Sets the font family to Roboto
      fontFamily: ['Roboto'],
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderColor: 'red',
          },
        },
      },
      // MuiButton: {
      //   styleOverrides: {
      //     root: ({ ownerState }) => ({
      //       ...(ownerState.variant === 'contained' && {
      //         borderRadius: 100,
      //         boxShadow: 'none',
      //         padding: '10px 20px',
      //       }),
      //     }),
      //   },
      // },
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.variant === 'contained' && {
              borderRadius: 100,
              fontFamily: 'Roboto',
              backgroundColor: '#cee7fd',
              color: '#0284fe',
              boxShadow: 'none',
              padding: '10px 20px',
              '&:hover': {
                background: '#a9d7ff',
                boxShadow: 'none',
              },
            }),
          }),
        },
      },
      // MuiLoadingButton: {
      //   styleOverrides: {
      //     root: ({ ownerState }) => ({
      //       ...(ownerState.variant === 'contained' && {
      //         borderRadius: 100,
      //         boxShadow: 'none',
      //         padding: '10px 20px',
      //       }),
      //     }),
      //   },
      // },
      MuiLoadingButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.variant === 'contained' && {
              borderRadius: 100,
              fontFamily: 'Roboto',
              backgroundColor: '#cee7fd',
              color: '#0284fe',
              boxShadow: 'none',
              padding: '10px 20px',
              '&:hover': {
                background: '#a9d7ff',
                boxShadow: 'none',
              },
            }),
          }),
        },
      },
    },
  };

  if (mode === 'light') {
    theme.palette['background'] = { paper: '#f1f0f0' };
    theme.palette['primary'] = {
      // main: '#52acfe',
      main: '#0284fe',
      highlight: '#e6f3ff',
    };
  } else {
    theme.palette['background'] = { default: '#1b1b1f', paper: '#262629' };
    theme.palette['primary'] = {
      // main: '#004687',
      main: '#0284fe',
      highlight: '#004687',
    };
  }

  return theme;
}

function App() {
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode.value);

  // Create custom theme
  const theme = useMemo(() => {
    const theme = createTheme(getThemeDict(mode));
    dispatch(setTheme(JSON.stringify(theme)));
    return theme;
  }, [mode]);

  const themeCSSVars = useMemo(() => themeParser(theme), [theme]);
  console.log(themeCSSVars);

  return (
    // Inject theme in CSS variables
    <div style={themeCSSVars}>
      <StyledEngineProvider injectFirst>
        {/* Assign custom theme */}
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Skeleton />}>
            <Routes>
              {/* Root directory */}
              <Route path='/'>
                {/* Assigns a component to the root directory */}
                <Route index element={<Entry />} />
                {/* Login page */}
                <Route path='login' element={<Login />} />
                {/* Sign Up page */}
                <Route path='signup' element={<SignUp />} />
                {/* Home page */}
                <Route
                  path='dashboard'
                  element={
                    // Requires user to be authenicated to visit
                    <RequireAuth>
                      <Suspense fallback={<DashboardLoading />}>
                        <Dashboard />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                {/* Logs edit page */}
                <Route
                  path='logs/edit/:id'
                  element={
                    // Requires user to be authenicated to visit
                    <RequireAuth>
                      <LogsEditPage />
                    </RequireAuth>
                  }
                />
                {/* Reports page */}
                <Route
                  path='reports'
                  element={
                    // Requires user to be authenicated to visit
                    <RequireAuth>
                      <Reports />
                    </RequireAuth>
                  }
                />
                {/* Logs page */}
                <Route
                  path='logs'
                  element={
                    // Requires user to be authenicated to visit
                    <RequireAuth>
                      <Suspense fallback={<LogsLoading />}>
                        <Logs />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                {/* Clients and projects page */}
                <Route
                  path='clients-and-projects'
                  element={
                    // Requires user to be authenicated to visit
                    <RequireAuth>
                      <Suspense fallback={<ClientsAndProjectsLoading />}>
                        <ClientAndProjects />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                {/* Clients and projects edit page */}
                <Route
                  path='clients-and-projects/edit/:type/:id'
                  element={
                    // Requires user to be authenicated to visit
                    <RequireAuth>
                      <CPEditPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path='report-export'
                  element={
                    <RequireAuth>
                      <ReportPDF />
                    </RequireAuth>
                  }
                />
              </Route>
              {/* Path of report PDF elements */}
            </Routes>
          </Suspense>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
export { getThemeDict };
