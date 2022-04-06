// Import React components
import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
// Import redux components
import { Provider } from 'react-redux';
import store from './Store';
// Import custom components
import RequireAuth from './Components/RequireAuth';
import Entry from './Components/Entry';
import Login from './Components/Login';
import SignUp from './Components/Signup';
const Dashboard = lazy(() => import('./Components/Dashboard'));
const LogsEditPage = lazy(() => import('./Components/EditLogs'));
const Reports = lazy(() => import('./Components/Reports.js'));
const Logs = lazy(() => import('./Components/Logs'));
const ClientAndProjects = lazy(() => import('./Components/ClientsAndProjects'));
const CPEditPage = lazy(() => import('./Components/EditCP'));

// Create custom theme
const theme = createTheme({
  palette: {
    //Dark or light theme
    mode: 'light',
    // Primary color
    primary: {
      main: '#3f51b5',
    },
    // Seconday color
    secondary: {
      main: '#f50057',
    },
    // Divider color
    divider: '#929292',
    // Password visible on colour
    visiblity: {
      main: '#81c784',
    },
    // Password visible off colour
    visibilityOff: {
      main: '#b4b2b2',
    },
  },
  // Edits the typography component styles
  typography: {
    // Sets the font family to Roboto
    fontFamily: ['Roboto'],
  },
});

// Components to render
render(
  <React.StrictMode>
    {/* Remove after development */}
    <BrowserRouter>
      {/* Loads custom CSS */}
      <StyledEngineProvider injectFirst>
        {/* Assign custom theme */}
        <ThemeProvider theme={theme}>
          {/* Provides redux global state to all components */}
          <Provider store={store}>
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
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                  {/* Logs edit page */}
                  <Route
                    path='/logs/edit/:id'
                    element={
                      // Requires user to be authenicated to visit
                      <RequireAuth>
                        <LogsEditPage />
                      </RequireAuth>
                    }
                  />
                  {/* Reports page */}
                  <Route
                    path='/reports'
                    element={
                      // Requires user to be authenicated to visit
                      <RequireAuth>
                        <Reports />
                      </RequireAuth>
                    }
                  />
                  {/* Logs page */}
                  <Route
                    path='/logs'
                    element={
                      // Requires user to be authenicated to visit
                      <RequireAuth>
                        <Logs />
                      </RequireAuth>
                    }
                  />
                  {/* Clients and projects page */}
                  <Route
                    path='/clients-and-projects'
                    element={
                      // Requires user to be authenicated to visit
                      <RequireAuth>
                        <ClientAndProjects />
                      </RequireAuth>
                    }
                  />
                  {/* Clients and projects edit page */}
                  <Route
                    path='/clients-and-projects/edit/:type/:id'
                    element={
                      // Requires user to be authenicated to visit
                      <RequireAuth>
                        <CPEditPage />
                      </RequireAuth>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
