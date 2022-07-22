// Import CSS Components
import './../Styles/Global.css';
import './../Styles/Login.css';
// Import Material UI Components
import EmailIcon from '@mui/icons-material/EmailOutlined';
import VisibilityFilled from '@mui/icons-material/Visibility';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// Import React Components
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import Axios
import { CssBaseline, TextField } from '@mui/material';
import GoogleLoginButton from '../Components/GoogleLoginButton';
import LoginRequest from '../Components/LoginRequest';
import ModeToggle from '../Components/ModeToggle';

function Login() {
  // Creates a navigate function
  const navigate = useNavigate();

  // Sets all the state
  // Store the email and password field
  const [inputData, updateInputData] = useState({
    email: '',
    password: '',
  });
  // Stores whether password should be visible
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  // Stores whether email or password is invalid
  const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState(false);
  // Stores whether the remember field is checked
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/dashboard', { replace: true });
    }
  });

  // Handles the show password button
  function handleShowPassword() {
    // Reverses the passwordVisibility
    // True -> false or false -> true
    setPasswordVisibility(!passwordVisibility);
  }

  // Handles the login in field changing
  function handleLoginChange(e) {
    // Updates the inputData state with the latest value for the field that is changed
    updateInputData({
      // Inserts the old data
      ...inputData,
      // Updates the value for whatever field is changed
      [e.target.id]: e.target.value,
    });

    // Reset the email or password invalid back to false
    setInvalidEmailOrPassword(false);
  }

  // Handles submit button click
  function handleSubmit(event) {
    // Prevents the default action on button click
    event.preventDefault();

    LoginRequest(inputData, rememberMe, setInvalidEmailOrPassword, navigate);
  }

  // Handle remember me check box change
  function handleRememberMeChange() {
    // Reverses the rememberMe state
    setRememberMe(!rememberMe);
  }

  // This is JSX code rendered
  return (
    // Wraps all element with a form to comply with chrome guidelines
    <div>
      <CssBaseline />
      <ModeToggle
        sx={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          backgroundColor: 'background.default',
        }}
      />
      {/* Container box */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          bgcolor: '#0093E9',
          backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
        }}
      >
        <form>
          {/* Paper for shadow effect */}
          <Paper sx={{ padding: '3rem' }}>
            <Grid container direction='column' spacing={2}>
              <Grid item container direction='column' spacing={0.5}>
                <Grid item>
                  <Typography variant='h5' width='100%' align='center'>
                    LOGIN INTO YOUR ACCOUNT
                  </Typography>
                </Grid>
                <Grid item>
                  {/* Stack components horizontially */}
                  <Stack
                    direction='row'
                    spacing={0.5}
                    justifyContent='center'
                    width='center'
                  >
                    <Typography className='loginCreateAccountCaption'>
                      Don't have an account?
                    </Typography>
                    {/* Creates a link to the signup page */}
                    <Typography
                      component={Link}
                      to='/signup'
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      Create one
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Grid item>
                {/* Input field for email */}
                <TextField
                  // Defines when the textfield is in error mode
                  error={invalidEmailOrPassword}
                  // Sets the id to email
                  id='email'
                  // Sets the label to email
                  label='EMAIL'
                  variant='outlined'
                  // Sets the autocomplete type for the browser
                  autoComplete='email'
                  // Run handleLoginChange when the field input changes
                  onChange={handleLoginChange}
                  sx={{ width: '100%' }}
                  // Add a email icon at the end of the the textfield
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {/* Sets color to the same as visiblityOff for show password button */}
                        <EmailIcon sx={{ color: 'grey.600' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                {/* Input field for password */}
                <TextField
                  // Defines when the textfield is in error mode
                  error={invalidEmailOrPassword}
                  // Sets the id to password
                  id='password'
                  variant='outlined'
                  // Sets the label to password
                  label='PASSWORD'
                  // Text the is displayed before the user types in the field
                  placeholder='password'
                  // Sets the type to text of password based on between passwordVisiblity is true of false
                  // If it is text, it is visible. Else if it is password, it is not visible
                  type={passwordVisibility ? 'text' : 'password'}
                  // Sets the autocomplete type for the browser
                  autoComplete='current-password'
                  // Run handleLoginChange when the field input changes
                  onChange={handleLoginChange}
                  sx={{ width: '100%' }}
                  // Add a password view button at the end of the the textfield
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          // Run handleShowPassword onClick of the button
                          onClick={handleShowPassword}
                          sx={{ padding: 0, margin: 0 }}
                        >
                          {passwordVisibility ? (
                            // If the passwordVisibility is true, make the icon green
                            <VisibilityFilled color='visiblity' />
                          ) : (
                            // If the passwordVisibility is true, make the icon white with grey outline
                            <VisibilityOutlined sx={{ color: 'grey.600' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                sx={
                  invalidEmailOrPassword
                    ? {}
                    : { padding: '0rem !important', margin: '0rem !important' }
                }
              >
                {/* Hides and reveals the error element */}
                <Collapse
                  // Sets invalidEmailOrPassword to state to define whether error is visible
                  in={invalidEmailOrPassword}
                  // Sets the CSS class to createPasswordCollapse
                  className='createPasswordCollapse'
                >
                  {/* Error element */}
                  <Alert
                    // Sets style to error
                    severity='error'
                    width='100%'
                  >
                    The email or password is invalid
                  </Alert>
                </Collapse>
              </Grid>
              <Grid item>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {/* Check box */}
                  <FormControlLabel
                    // Defines elements controlled
                    control={
                      // Checkbox element
                      <Checkbox
                        // Sets checked to rememberMe to state
                        checked={rememberMe}
                        // Run handleRememberMeChange when the checked state changes
                        onChange={handleRememberMeChange}
                      />
                    }
                    // Sets label to remember me
                    label='Remember me'
                  />
                </div>
              </Grid>
              <Grid item>
                {/* Login button */}
                <Button
                  // Sets the type to submit
                  // This allows the enter to submit the form
                  type='submit'
                  // Set variant to contained
                  variant='contained'
                  // Makes the button the full width of the box
                  fullWidth
                  // Runs handleSubmit on click
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              </Grid>
              <Grid item>
                <Typography align='center' width='100%'>
                  OR
                </Typography>
              </Grid>
              <Grid item>
                <GoogleLoginButton signUp={false} sx={{ width: '100%' }} />
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Box>
    </div>
  );
}

// Exports Login
export default Login;
