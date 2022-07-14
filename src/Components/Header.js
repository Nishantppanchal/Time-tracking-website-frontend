// Import MUI components
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
// Import React components
import { useNavigate } from 'react-router-dom';
// Import axios instance
import AxiosInstance from '../Axios';
import {
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { getMode } from '../App';

import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { toggleMode } from '../Features/Mode';
import Brightness4 from '@mui/icons-material/Brightness4';

function Header(props) {
  // Defines the navigate function used to redirect to the other pages
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.mode.value);

  // Handles redirecting to the dashboard page
  function handleGoToDashboard(event) {
    // Disables the default behavior of the button
    event.preventDefault();
    // Redirects to the dashboard page
    navigate('/dashboard');
  }

  // Handles redirecting to the reports page
  function handleGoToReports(event) {
    event.preventDefault();
    // Redirects to the reports page
    navigate('/reports');
  }

  // Handles redirecting to the logs page
  function handleGoToLogs(event) {
    // Disables the default behavior of the button
    event.preventDefault();
    // Redirects to the logs page
    navigate('/logs');
  }

  // Handles redirecting to the clients and projects page
  function handleGoToCP(event) {
    // Disables the default behavior of the button
    event.preventDefault();
    // Redirects to the clients and projects page
    navigate('/clients-and-projects');
  }

  // Handles redirecting to the user account page
  function handleGoToAccount(event) {
    // Disables the default behavior of the button
    event.preventDefault();
    // Redirects to the user account page
    navigate('/account');
  }

  // Handles logging out the user
  function handleLogout(event) {
    // Sends a POST request to revoke the refresh token
    AxiosInstance.post('auth/revoke-token/', {
      // Sets the refresh token to be revoked
      token: localStorage.getItem('refresh_token')
        ? localStorage.getItem('refresh_token')
        : sessionStorage.getItem('refresh_token'),
      // Sets the token type to refresh token
      token_type_hint: 'refresh_token',
      // Get the client id from the .env file
      client_id: process.env.REACT_APP_CLIENT_ID,
    });

    // Sends a POST request to revoke the access token
    AxiosInstance.post('auth/revoke-token/', {
      // Sets the access token to be revoked
      token: localStorage.getItem('access_token')
        ? localStorage.getItem('access_token')
        : sessionStorage.getItem('access_token'),
      // Sets the token type to access token
      token_type_hint: 'access_token',
      // Get the client id from the .env file
      client_id: process.env.REACT_APP_CLIENT_ID,
    });

    if (localStorage.getItem('access_token')) {
      // Removes the access token from localstorage
      localStorage.removeItem('access_token');
      // Removes the refresh token from localstorage
      localStorage.removeItem('refresh_token');
      // Removes user id from localstorage
      localStorage.removeItem('user_id');
    } else {
      // Removes the access token from sessionstorage
      sessionStorage.removeItem('access_token');
      // Removes the refresh token from sessionstorage
      sessionStorage.removeItem('refresh_token');
      // Removes user id from sessionstorage
      sessionStorage.removeItem('user_id');
    }
    // Redirects to the login page
    navigate('/login');
  }

  function handleChangeMode(event, newMode) {
    event.preventDefault();
    if (newMode !== null) {
      dispatch(toggleMode());
    }
  }

  // This is the JSX that will be rendered
  return (
    // The app bar component
    <AppBar
      position='sticky'
      sx={{ bgcolor: 'background.default', boxShadow: 'none' }}
    >
      {/* Tool bar component as used by MUI documentation */}
      <Toolbar>
        {/* Site name button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'primary' }}
          // Runs the handleGoToDashboard function when clicked
          onClick={handleGoToDashboard}
        >
          TRACKABLE
        </Button>
        {/* Spacer Box */}
        <Box sx={{ flexGrow: 1 }} />
        {/* Dashboard button */}
        <Button
          variant='text'
          size='large'
          sx={
            props.page === 'dashboard'
              ? { color: 'primary' }
              : { color: 'text.primary', ':hover': { color: 'primary' } }
          }
          // Runs the handleGoToDashboard function when clicked
          onClick={handleGoToDashboard}
        >
          DASHBOARD
        </Button>
        {/* Logs button */}
        <Button
          variant='text'
          size='large'
          sx={
            props.page === 'logs'
              ? { color: 'primary' }
              : { color: 'text.primary', ':hover': { color: 'primary' } }
          }
          // Runs the handleGoToLogs function when clicked
          onClick={handleGoToLogs}
        >
          LOGS
        </Button>
        {/* Reports button */}
        <Button
          variant='text'
          size='large'
          sx={
            props.page === 'reports'
              ? { color: 'primary' }
              : { color: 'text.primary', ':hover': { color: 'primary' } }
          }
          // Runs the handleGoToReports function when clicked
          onClick={handleGoToReports}
        >
          REPORTS
        </Button>
        {/* Clients and projects button */}
        <Button
          variant='text'
          size='large'
          sx={
            props.page === 'clients and projects'
              ? { color: 'primary' }
              : { color: 'text.primary', ':hover': { color: 'primary' } }
          }
          // Runs the handleGoToCP function when clicked
          onClick={handleGoToCP}
        >
          CLIENTS AND PROJECTS
        </Button>
        {/* Accounts button */}
        <Button
          variant='text'
          size='large'
          sx={
            props.page === 'account'
              ? { color: 'primary' }
              : { color: 'text.primary', ':hover': { color: 'primary' } }
          }
          // Runs the handleGoToAccount function when clicked
          onClick={handleGoToAccount}
        >
          ACCOUNT
        </Button>
        {/* Logout button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'text.primary', ':hover': { color: 'primary' } }}
          onHover
          // Runs the handleLogout function when clicked
          onClick={handleLogout}
        >
          LOGOUT
        </Button>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleChangeMode}
          size='small'
          sx={{ paddingLeft: '10px' }}
        >
          <ToggleButton value='light'>
            <LightModeIcon />
          </ToggleButton>
          <ToggleButton value='dark'>
            <DarkModeIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
    </AppBar>
  );
}

// Exports the Header component
export default Header;
