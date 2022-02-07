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

function Header() {
  // Defines the navigate function used to redirect to the other pages
  const navigate = useNavigate();

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

  // Handles redirecting to the tags page
  function handleGoToTags(event) {
    // Disables the default behavior of the button
    event.preventDefault();
    // Redirects to the tags page
    navigate('/tags');
  }

  // Handles redirecting to the clients and projects page
  function handleGoToCP(event) {
    // Disables the default behavior of the button
    event.preventDefault();
    // Redirects to the clients and projects page
    navigate('/client-and-projects');
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
      token: localStorage.getItem('refresh_token'),
      // Sets the token type to refresh token
      token_type_hint: 'refresh_token',
      // Get the client id from the .env file
      client_id: process.env.REACT_APP_CLIENT_ID,
    });

    // Sends a POST request to revoke the access token
    AxiosInstance.post('auth/revoke-token/', {
      // Sets the access token to be revoked
      token: localStorage.getItem('access_token'),
      // Sets the token type to access token
      token_type_hint: 'access_token',
      // Get the client id from the .env file
      client_id: process.env.REACT_APP_CLIENT_ID,
    });

    // Removes the access token from localstorage
    localStorage.removeItem('access_token');
    // Removes the refresh token from localstorage
    localStorage.removeItem('refresh_token');

    // Redirects to the login page
    navigate('/login');
  }

  // This is the JSX that will be rendered
  return (
    // The app bar component
    <AppBar position='static'>
      {/* Tool bar component as used by MUI documentation */}
      <Toolbar>
        {/* Site name button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToDashboard function when clicked
          onClick={handleGoToDashboard}
        >
          TRACKABLE
        </Button>
        {/* Divider */}
        <Divider orientation='vertical' variant='middle' flexItem />
        {/* Dashboard button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToDashboard function when clicked
          onClick={handleGoToDashboard}
        >
          DASHBOARD
        </Button>
        {/* Logs button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToLogs function when clicked
          onClick={handleGoToLogs}
        >
          LOGS
        </Button>
        {/* Reports button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToReports function when clicked
          onClick={handleGoToReports}
        >
          REPORTS
        </Button>
        {/* Tags button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToTags function when clicked
          onClick={handleGoToTags}
        >
          TAGS
        </Button>
        {/* Clients and projects button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToCP function when clicked
          onClick={handleGoToCP}
        >
          CLIENTS AND PROJECTS
        </Button>
        {/* Accounts button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleGoToAccount function when clicked
          onClick={handleGoToAccount}
        >
          ACCOUNT
        </Button>
        {/* Spacer Box */}
        <Box sx={{ flexGrow: 1 }} />
        {/* Logout button */}
        <Button
          variant='text'
          size='large'
          sx={{ color: 'white' }}
          // Runs the handleLogout function when clicked
          onClick={handleLogout}
        >
          LOGOUT
        </Button>
      </Toolbar>
    </AppBar>
  );
}

// Exports the Header component
export default Header;
