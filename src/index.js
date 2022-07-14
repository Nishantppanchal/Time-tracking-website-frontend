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
import Entry from './Pages/Entry';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import DashboardLoading from './Loading Components/DashboardLoading';
import LogsLoading from './Loading Components/LogsLoading';
import ClientsAndProjectsLoading from './Loading Components/ClientsAndProjectsLoading';
import App from './App';
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const LogsEditPage = lazy(() => import('./Pages/EditLogs'));
const Reports = lazy(() => import('./Pages/Reports.js'));
const Logs = lazy(() => import('./Pages/Logs'));
const ClientAndProjects = lazy(() => import('./Pages/ClientsAndProjects'));
const CPEditPage = lazy(() => import('./Pages/EditCP'));

// Components to render
render(
  <BrowserRouter>
    {/* Provides redux global state to all components */}
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
