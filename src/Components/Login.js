// Import CSS Components
import './../Styles/Global.css';
import './../Styles/Login.css';
// Import Material UI Components
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import VisibilityFilled from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// Import React Components
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// Import Axios
import axios from 'axios';
import axiosInstance from '../Axios';

function Login() {
  // Creates a navigate function
  let navigate = useNavigate();

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
      [e.target.name]: e.target.value,
    });

    // Reset the email or password invalid back to false
    setInvalidEmailOrPassword(false);
  }

  // Handles submit button click
  function handleSubmit(event) {
    // Prevents the default action on button click
    event.preventDefault();

    // Post user login info
    axios
      .post('http://127.0.0.1:8000/api/auth/token/', {
        // Get the client id from the .env file
        client_id: process.env.REACT_APP_CLIENT_ID,
        // Sets the grant type to password
        grant_type: 'password',
        // Sets the email as the username
        username: inputData.email,
        // Sets the password to the password the user entered
        password: inputData.password,
      })
      // Handles the response
      .then((response) => {
        // Clears all the local storage and session storage values if there are any
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');

        // If the user checked remember me
        if (rememberMe) {
          // Set the access token in localStorage
          // Under the name access_token
          localStorage.setItem('access_token', response.data.access_token);
          // Set the refresh token in localStorage
          // Under the name refresh_token
          localStorage.setItem('refresh_token', response.data.refresh_token);
          // Otherwise, if the user has not checked remember me
        } else {
          // Set the access token in sessionStorage
          // Under the name access_token
          sessionStorage.setItem('access_token', response.data.access_token);
          // Set the refresh token in sessionStorage
          // Under the name refresh_token
          sessionStorage.setItem('refresh_token', response.data.refresh_token);
        }

        // Forces the access token in the header fo the axiosInstance to change
        axiosInstance.defaults.headers['Authorization'] =
          'Bearer ' + response.data.access_token;
      })
      // After the tokens are stored
      .then(() => {
        // Clears the local storage and session storage values if there are any
        localStorage.removeItem('user_id');
        sessionStorage.removeItem('user_id');

        // Gets the user ID
        axiosInstance
          .get('user/id/')
          // Handles the response
          .then((response) => {
            // If the user has checked remember me
            if (rememberMe) {
              // Stores the user ID in localStorage
              // Under the name user_id
              localStorage.setItem('user_id', response.data[0].id);
              // Otherwise, if the user has not checked remember me
            } else {
              // Stores the user ID in sessionStorage
              // Under the name user_id
              sessionStorage.setItem('user_id', response.data[0].id);
            }

            // Pushs the user to the dashboard page
            // Replace prevent the user from going back to the login page
            navigate('/dashboard', { replace: true });
          })
          .catch((error) => {
            // If the access token was invalid
            if (
              error.response.data.detail ===
              'In1valid token header. No credentials provided.'
            ) {
              // If the user has checked remember me
              if (rememberMe) {
                // Stores the user ID in localStorage
                // Under the name user_id
                localStorage.setItem(
                  'user_id',
                  error.response.data.requestData.data[0].id
                );
                // Otherwise, if the user has not checked remember me
              } else {
                // Stores the user ID in sessionStorage
                // Under the name user_id
                sessionStorage.setItem(
                  'user_id',
                  error.response.data.requestData.data[0].id
                );
              }

              // Pushs the user to the dashboard page
              // Replace prevent the user from going back to the login page
              navigate('/dashboard', { replace: true });
            }
          });
      })
      // Handles errors
      .catch((error) => {
        // If the error's status code is 400
        if (error.response.status === 400) {
          // Set the invalidEmailOrPassword to true
          // This cause an error prompt
          setInvalidEmailOrPassword(true);
        }
      });
  }

  // Handle remember me check box change
  function handleRememberMeChange() {
    // Reverses the rememberMe state
    setRememberMe(!rememberMe);
  }

  // This is JSX code rendered
  return (
    // Wraps all element with a form to comply with chrome guidelines
    <form>
      {/* Container box */}
      <Box className='containerBox'>
        {/* Paper for shadow effect */}
        <Paper className='loginPaper'>
          <Typography variant='h5'>Login into your account </Typography>
          {/* Stack components horizontially */}
          <Stack direction='row' spacing={0.5}>
            <Typography className='loginCreateAccountCaption'>
              Don't have an account yet?
            </Typography>
            {/* Creates a link to the signup page */}
            <Typography component={Link} to='/signup' className='createOneLink'>
              Create one
            </Typography>
          </Stack>
          {/* Spacer box */}
          <Box fullWidth className='spacerLogin' />
          {/* Input field for email */}
          <InputBase
            // Defines when the textfield is in error mode
            error={invalidEmailOrPassword}
            // Sets the name to email
            name='email'
            // Sets the id to email
            id='email'
            // Sets the label to email
            label='email'
            // Sets the styles CSS class to EmailField
            className='EmailField'
            // Text the is displayed before the user types in the field
            placeholder='jamesdoe@gmail.com'
            // Sets the autocomplete type for the browser
            autoComplete='email'
            // Run handleLoginChange when the field input changes
            onChange={handleLoginChange}
            // Add a email icon at the end of the the textfield
            endAdornment={
              <InputAdornment position='end'>
                {/* Sets color to the same as visiblityOff for show password button */}
                <EmailIcon color='visibilityOff' />
              </InputAdornment>
            }
          />
          {/* Input field for password */}
          <InputBase
            // Defines when the textfield is in error mode
            error={invalidEmailOrPassword}
            // Sets the name to password
            name='password'
            // Sets the id to password
            id='password'
            // Sets the label to password
            label='password'
            // Text the is displayed before the user types in the field
            placeholder='password'
            // Sets the styles CSS class to PasswordField
            className='PasswordField'
            // Sets the type to text of password based on between passwordVisiblity is true of false
            // If it is text, it is visible. Else if it is password, it is not visible
            type={passwordVisibility ? 'text' : 'password'}
            // Sets the autocomplete type for the browser
            autoComplete='current-password'
            // Run handleLoginChange when the field input changes
            onChange={handleLoginChange}
            // Add a password view button at the end of the the textfield
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  // Align the icon with the email icon above
                  edge='end'
                  // Run handleShowPassword onClick of the button
                  onClick={handleShowPassword}
                >
                  {passwordVisibility ? (
                    // If the passwordVisibility is true, make the icon green
                    <VisibilityFilled color='visiblity' />
                  ) : (
                    // If the passwordVisibility is true, make the icon white with grey outline
                    <VisibilityOutlined color='visibilityOff' />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          {/* Hides and reveals the error element */}
          <Collapse
            // Sets invalidEmailOrPassword to state to define whether error is visible
            in={invalidEmailOrPassword}
            // Sets the CSS class to createPasswordCollapse
            className='createPasswordCollapse'
          >
            {/* Container box */}
            <Box className='collapseBoxAlign'>
              {/* Error element */}
              <Alert
                // Sets style to error
                severity='error'
                // Sets the CSS class to passwordAlert
                className='passwordAlert'
              >
                The email or password is invalid
              </Alert>
            </Box>
          </Collapse>
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
          {/* Wrapper box */}
          <Box width='80%'>
            {/* Login button */}
            <Button
              // Sets the type to submit
              // This allows the enter to submit the form
              type='submit'
              // Set variant to contained
              variant='contained'
              // Set the CSS class to loginRoundButton
              className='loginRoundButton'
              // Makes the button the full width of the box
              fullWidth
              // Runs handleSubmit on click
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </form>
  );
}

// Exports Login
export default Login;
