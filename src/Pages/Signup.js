// Import React components
import { useState } from 'react';
// Import CSS Components
import './../Styles/Global.css';
import './../Styles/Signup.css';
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
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
// Import React Components
import { Link, useNavigate } from 'react-router-dom';
// Import Custom Components
import passwordValidator from '../Components/PasswordValidator';
// Import Axios
import axios from 'axios';
import { baseURL } from '../Axios';
import { CssBaseline, TextField } from '@mui/material';
import ModeToggle from '../Components/ModeToggle';
import Stack from '@mui/material/Stack';
import { TransitionGroup } from 'react-transition-group';
import GoogleLoginButton from '../Components/GoogleLoginButton';

function SignUp() {
  // Creates navigate function
  let navigate = useNavigate();

  // Defines all the states
  // stores all the form data
  const [inputData, updateInputData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    retypedPassword: '',
  });
  // Stores whether password should be visible
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  // Stores whether the password retype is prompted
  const [retypePasswordStatus, setRetypePasswordStatus] = useState(false);
  // Stores whether the password is valid and the errors
  const [passwordValidationStatus, setPasswordValidationStatus] = useState({
    hasError: false,
    errors: [],
  });
  // Stores whether first name, last name and email fields are valid and their errors
  const [formValidationStatus, setFormValidationStatus] = useState({
    firstName: { hasError: false, errors: null },
    lastName: { hasError: false, errors: null },
    email: { hasError: false, errors: null },
  });

  // Handles the show password button
  function handleShowPassword() {
    // Reverses the passwordVisibility
    // True -> false or false -> true
    setPasswordVisibility(!passwordVisibility);
  }

  // Handles the login in field changing
  function handleRegisterChange(event) {
    // Updates the inputData state with the latest value for the field that is changed
    updateInputData({
      // Inserts the old data
      ...inputData,
      // Updates the value for whatever field is changed
      [event.target.id]: event.target.value,
    });
    if (event.target.id === 'password') {
      if (event.target.value !== '') {
        setRetypePasswordStatus(true);
      } else {
        setRetypePasswordStatus(false);
      }
    }

    // If the field changed is the password or retyped password field
    if (
      event.target.id === 'password' ||
      event.target.id === 'retypedPassword'
    ) {
      if (event.target.value === '' && event.target.id === 'password') {
        setPasswordValidationStatus({
          // Sets hasError to false
          hasError: false,
          // Makes error an empty string
          errors: [],
        });
      } else {
        const errors =
          // If the changed field is the password field
          event.target.id === 'password'
            ? // Run the password and retypedPassword through password validation
              // The constant error stores the errors array
              passwordValidator(event.target.value, inputData.retypedPassword)
            : // Run the password and retypedPassword through password validation
              // The constant error stores the errors array
              passwordValidator(inputData.password, event.target.value);

        // If there are more than one error
        if (errors.length > 0) {
          // Set the passwordValidationStatus state
          setPasswordValidationStatus({
            // Sets hasError to true
            hasError: true,
            // Insert the errors array
            errors: errors,
          });
          // If there are zero errors
        } else {
          setPasswordValidationStatus({
            // Sets hasError to false
            hasError: false,
            // Makes error an empty string
            errors: [],
          });
        }
      }
      // If the field changed is empty
    } else if (event.target.value != '') {
      // Resets the formValidationStatus state for the field to no errors
      setFormValidationStatus({
        ...formValidationStatus,
        [event.target.id]: { hasError: false, errors: null },
      });
    }
  }

  // Handles submit button click
  function handleSubmit(event) {
    // Prevent default actions on button click
    event.preventDefault();

    // Make a variable, error, with the value false
    var error = false;
    // Stores formValidationStatus in data variable
    var data = formValidationStatus;
    // If pass validation has one or more errors
    if (
      passwordValidator({
        password: inputData.password,
        retypedPassword: inputData.retypedPassword,
      }).length > 0
    ) {
      // Set the error variable to true
      error = true;
    }
    // If the password field is empty
    if (inputData.password === '') {
      // Set the passwordValidationStatus to have hasError to true and add passsword field empty error
      setPasswordValidationStatus({
        // Sets hasError to true
        hasError: true,
        // Set errors to a array
        errors: [
          // Remove duplicates
          ...new Set([
            'password field is empty',
            ...passwordValidationStatus.errors,
          ]),
        ],
      });

      // Sets the error variable to true
      error = true;
    }
    // If the first name field is empty
    if (inputData.firstName === '') {
      // Changes the firstName field in data to have the field is empty error
      data = {
        ...data,
        firstName: { hasError: true, errors: 'field is empty' },
      };

      // Sets the error variable to true
      error = true;
    }
    // If the last name field is empty
    if (inputData.lastName === '') {
      // Changes the lastName field in data to have the field is empty error
      data = {
        ...data,
        lastName: { hasError: true, errors: 'field is empty' },
      };

      // Sets the error variable to true
      error = true;
    }
    // If the email field is empty
    if (inputData.email === '') {
      // Changes the email field in data to have the field is empty error
      data = {
        ...data,
        email: { hasError: true, errors: 'field is empty' },
      };

      // Sets the error variable to true
      error = true;
    }

    // Sets the formValidationStatus state to the data variable
    setFormValidationStatus(data);

    // If the error variable is false
    if (error === false) {
      // Send a post request to create the user
      axios
        .post(baseURL + 'user/register/', {
          // Defines the required field from the inputData state
          first_name: inputData.firstName,
          last_name: inputData.lastName,
          email: inputData.email.toLowerCase(),
          password: inputData.password,
        })
        // Handles the response
        .then((response) => {
          // If the user was created
          if (response.status === 201) {
            // Pushes the user to the login page
            navigate('/login', { replace: true });
          }
        })
        // Handles errors
        .catch((error) => {
          // If the error status code is 400
          if (error.response.status === 400) {
            // Set the formValidationStatus state to have the error: this email is already in use
            setFormValidationStatus({
              ...formValidationStatus,
              email: { hasError: true, errors: 'This email is already in use' },
            });
          }
        });
    }
  }

  // This is the JSX code rendered
  return (
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
      {/* Wraps all element with a form to comply with chrome guidelines */}
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
        {/* Paper for shadow effect */}
        <Paper sx={{ padding: '3rem', width: '40%' }}>
          <form>
            {/* Grid to arrange components */}
            <Grid
              // Sets the the Grid as a container
              container
              // Sets the spacing between elements as 0
              spacing={2}
            >
              <Grid item container direction='column' spacing={0.5} xs={12}>
                <Grid item>
                  <Typography variant='h5' width='100%' align='center'>
                    CREATE AN ACCOUNT
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
                    <Typography>Already have a account?</Typography>
                    {/* Creates a link to the signup page */}
                    <Typography
                      component={Link}
                      to='/login'
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      Login
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              {/* Grid cell */}
              <Grid item xs={6}>
                {/* First name input field */}
                <TextField
                  // Sets whether input is in error mode to hasError
                  // hasError is in firstName dictionary inside the formValidationStatus state dictionary
                  error={formValidationStatus.firstName.hasError}
                  // Sets id as firstName
                  id='firstName'
                  // Text the is displayed before the user types in the field
                  label='FIRST NAME'
                  fullWidth
                  // Sets the autocomplete type for the browser
                  autoComplete='given-name'
                  // Run handleRegisterChange when the field input changes
                  onChange={handleRegisterChange}
                />
              </Grid>
              {/* Grid cell */}
              <Grid item xs={6}>
                {/* Last name input field */}
                <TextField
                  // Sets whether input is in error mode to hasError
                  // hasError is in lastName dictionary inside the formValidationStatus state dictionary
                  error={formValidationStatus.lastName.hasError}
                  // Sets id to lastName
                  id='lastName'
                  // Text the is displayed before the user types in the field
                  label='LAST NAME'
                  fullWidth
                  // Sets the autocomplete type for the browser
                  autoComplete='family-name'
                  // Run handleRegisterChange when the field input changes
                  onChange={handleRegisterChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Input field from email */}
                <TextField
                  // Sets whether input is in error mode to hasError
                  // hasError is in email dictionary inside the formValidationStatus state dictionary
                  error={formValidationStatus.email.hasError}
                  // Sets id to email
                  id='email'
                  // Text the is displayed before the user types in the field
                  label='EMAIL'
                  fullWidth
                  // Sets the autocomplete type for the browser
                  autoComplete='email'
                  // Run handleRegisterChange when the field input changes
                  onChange={handleRegisterChange}
                  // Add a email icon at the end of the the textfield
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {/* Sets color to the same as visiblityOff for show password button */}
                        <EmailIcon color='visibilityOff' />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Input field for password */}
                <TextField
                  // Sets id as password
                  id='password'
                  // Text the is displayed before the user types in the field
                  label='PASSWORD'
                  fullWidth
                  // Sets the type to text of password based on between passwordVisiblity is true of false
                  // If it is text, it is visible. Else if it is password, it is not visible
                  type={passwordVisibility ? 'text' : 'password'}
                  // Sets the autocomplete type for the browser
                  autoComplete='new-password'
                  // Run handleRegisterChange when the field input changes
                  onChange={handleRegisterChange}
                  // Defines when the textfield is in error mode to hasError value in passwordValidationStatus state
                  error={passwordValidationStatus.hasError}
                  // Add a password view button at the end of the the textfield
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        sx={{ padding: 0, margin: 0 }}
                      >
                        <IconButton
                          sx={{ padding: 0, margin: 0 }}
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
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Hides and reveals the retype password element */}
                <Collapse
                  // Sets retypePasswordStatus state to define whether the input field is visible
                  in={retypePasswordStatus}
                >
                  {/* Retype password input field */}
                  <TextField
                    // Sets id to retypedPassword
                    id='retypedPassword'
                    // Text the is displayed before the user types in the field
                    label='RETYPE PASSWORD'
                    fullWidth
                    // Sets the type to text of password based on between passwordVisiblity is true of false
                    // If it is text, it is visible. Else if it is password, it is not visible
                    type={passwordVisibility ? 'text' : 'password'}
                    // Sets the autocomplete type for the browser
                    autoComplete='new-password'
                    // Run handleRegisterChange when the field input changes
                    onChange={handleRegisterChange}
                    // Defines when the textfield is in error mode to hasError value in passwordValidationStatus state
                    error={passwordValidationStatus.hasError}
                    // Add a password view button at the end of the the textfield
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            sx={{ padding: 0, margin: 0 }}
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
                              <VisibilityOutlined color='grey.600' />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Collapse>
              </Grid>
              <Grid item xs={12}>
                {/* Hides and reveals the error element */}
                <TransitionGroup>
                  {passwordValidationStatus.errors.map((error) => {
                    // For each error a error element is rendered
                    return (
                      // Loops for all errors in errors array in passwordValidationStatus state
                      <Collapse
                        // Sets hasError value in passwordValidationStatus state to define whether error is visible
                        in={passwordValidationStatus.hasError}
                      >
                        {/* Error element */}
                        <Alert
                          // Sets the style to error
                          severity='error'
                        >
                          {error}
                        </Alert>
                      </Collapse>
                    );
                  })}
                </TransitionGroup>
              </Grid>
              <Grid item xs={12}>
                {/* Sign up button */}
                <Button
                  // Sets the type to submit
                  // This allows the enter to submit the form
                  type='submit'
                  // Sets the style to contained
                  variant='contained'
                  // Makes the button full width of the container box
                  fullWidth
                  // Runs handleSubmit on click
                  onClick={handleSubmit}
                >
                  SIGN UP
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography align='center' width='100%'>
                  OR
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <GoogleLoginButton signUp={true} sx={{ width: '100%' }} />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </div>
  );
}

// Exports Login
export default SignUp;
