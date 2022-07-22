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
  Icon,
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
import { clearMode, toggleMode } from '../Features/Mode';
import Brightness4 from '@mui/icons-material/Brightness4';
import { clearLoginMethod, loginMethodStates } from '../Features/LoginMethod';
import { googleLogout } from '@react-oauth/google';
import ModeToggle from './ModeToggle';
import { clearCP } from '../Features/CPData';
import { clearLogs } from '../Features/Logs';
import { clearReportData } from '../Features/ReportData';
import { clearTags } from '../Features/Tags';
import { clearTheme } from '../Features/Theme';
import ClockIcon from '../SVG/Clock.svg';

function Header(props) {
  // Defines the navigate function used to redirect to the other pages
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginMethod = useSelector((state) => state.loginMethod.value);

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
  function handleLogout() {
    // Sends a POST request to revoke the refresh token
    AxiosInstance.post('auth/revoke-token/', {
      // Sets the refresh token to be revoked
      token: localStorage.getItem('refresh_token')
        ? localStorage.getItem('refresh_token')
        : sessionStorage.getItem('refresh_token'),
      // Sets the token type to refresh token
      token_type_hint: 'refresh_token',
      // Get the client id from the .env file
      client_id: process.env.REACT_APP_DJANGO_CLIENT_ID,
    }).catch((error) => {
      console.log(error.response);
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
      client_id: process.env.REACT_APP_DJANGO_CLIENT_ID,
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

    switch (loginMethod) {
      case loginMethodStates.trackable:
        break;
      case loginMethodStates.google:
        googleLogout();
        break;
      default:
        console.error('Login in method not detected');
    }

    dispatch(clearCP());
    dispatch(clearLoginMethod());
    dispatch(clearLogs());
    dispatch(clearMode());
    dispatch(clearReportData());
    dispatch(clearTags());

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
          sx={{
            bgcolor: '#0093E9',
            backgroundImage:
              'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '100%',
            fontWeight: 'bold',
          }}
          // Runs the handleGoToDashboard function when clicked
          onClick={handleGoToDashboard}
          startIcon={
            <Icon>
              <div style={{ position: 'relative' }}>
                <img
                  src={ClockIcon}
                  alt='logo'
                  style={{
                    aspectRatio: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              </div>
            </Icon>
          }
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
          // Runs the handleLogout function when clicked
          onClick={handleLogout}
        >
          LOGOUT
        </Button>
        <ModeToggle sx={{ paddingLeft: '10px' }} />
      </Toolbar>
    </AppBar>
  );
}

// Exports the Header component
export default Header;
