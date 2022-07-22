// Import CSS styles
import './../Styles/Global.css';
// Import React components
import { useNavigate } from 'react-router-dom';
// Import Material UI components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { CssBaseline } from '@mui/material';
import ModeToggle from '../Components/ModeToggle';
import ClockIcon from '../SVG/Clock.svg';

function Home() {
  // Define navigate function
  let navigate = useNavigate();

  // Handles event when login button pressed
  function handleLoginButton() {
    // Sends user to login page
    navigate('/login/');
  }
  // Handles event when sign up button pressed
  function handleSignUpButton() {
    // Sends user to sign up page
    navigate('/signup/');
  }

  // This is the JSX rendered on page
  return (
    // Container Box
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <CssBaseline />
      <ModeToggle
        sx={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          backgroundColor: 'background.default',
        }}
      />
      {/* Grid for the two buttons */}
      <Grid container direction='row' rowSpacing={4} columnSpacing={8} width='40%'>
        <Grid item xs={12}>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <img src={ClockIcon} alt='logo' width='50%' />
          </div>
        </Grid>
        <Grid item xs={12}>
          {/* Website title */}
          <Typography
            variant='h1'
            width='100%'
            align='center'
            sx={{
              bgcolor: '#0093E9',
              backgroundImage:
                'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '100%',
            }}
          >
            TRACKABLE
          </Typography>
        </Grid>
        {/* Let button fill half the grid */}
        <Grid item xs={6}>
          {/* Login button */}
          <Button
            // Sets the varient of button to contained
            variant='contained'
            // Make the width 100%
            fullWidth
            // Assign handleLoginButton to run on click of this button
            onClick={handleLoginButton}
          >
            Login
          </Button>
        </Grid>
        {/* Let button fill half the grid */}
        <Grid item xs={6}>
          {/* Sign up button */}
          <Button
            // Sets the varient of button to contained
            variant='contained'
            // Make the width 100%
            fullWidth
            // Assign handleSignUpButton to run on click of this button
            onClick={handleSignUpButton}
          >
            SIGN UP
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// Exports Home
export default Home;
