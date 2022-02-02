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
import VisibilityOutlined from '@mui/icons-material/VibrationOutlined';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
// Import React Components
import { useNavigate } from 'react-router-dom';
// Import Custom Components
import passwordValidator from './PasswordValidator';
// Import Axios
import axios from 'axios';

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
  function handleRegisterChange() {
    // Updates the inputData state with the latest value for the field that is changed
    updateInputData({
      // Inserts the old data
      ...inputData,
      // Updates the value for whatever field is changed
      [e.target.name]: e.target.value,
    });
    if (e.target.name == 'password') {
      if (e.target.value != '') {
        setRetypePasswordStatus(true);
      } else {
        setRetypePasswordStatus(false);
      }
    }

    // If the field changed is the password or retyped password field
    if (e.target.name == 'password' || e.target.name == 'retypedPassword') {
      const inputs =
        // If the changed field is the password field
        e.target.name == 'password'
          ? {
              // Sets the password to the event value
              password: e.target.value,
              // Sets the retypedPassword to the retypedPassword value in the inputData state
              retypedPassword: inputData.retypedPassword,
            }
          : {
              // Sets the password to the password value in the inputData state
              password: inputData.password,
              // Sets the retypedPassword to the event value
              retypedPassword: e.target.value,
            };

      // Run the password and retypedPassword through password validation
      // The constant error stores the errors array
      const errors = passwordValidator(inputs);

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
        console.log('test');
        setPasswordValidationStatus({
          // Sets hasError to false
          hasError: false,
          // Makes error an empty string
          errors: [],
        });
      }
      // If the field changed is empty
    } else if (e.target.value != '') {
      // Resets the formValidationStatus state for the field to no errors
      setFormValidationStatus({
        ...formValidationStatus,
        [e.target.name]: { hasError: false, errors: null },
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
    if (inputData.password == '') {
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
    if (inputData.firstName == '') {
      // Changes the firstName field in data to have the field is empty error
      data = {
        ...data,
        firstName: { hasError: true, errors: 'field is empty' },
      };

      // Sets the error variable to true
      error = true;
    }
    // If the last name field is empty
    if (inputData.lastName == '') {
      // Changes the lastName field in data to have the field is empty error
      data = {
        ...data,
        lastName: { hasError: true, errors: 'field is empty' },
      };

      // Sets the error variable to true
      error = true;
    }
    // If the email field is empty
    if (inputData.email == '') {
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
    if (error == false) {
      // Send a post request to create the user
      axios
        .post('http://127.0.0.1:8000/api/user/register/', {
          // Defines the required field from the inputData state
          first_name: inputData.firstName,
          last_name: inputData.lastName,
          email: inputData.email,
          password: inputData.password,
        })
        // Handles the response
        .then((response) => {
          // If the user was created
          if (response.status === 201) {
            // Pushes the user to the home page
            navigate('/home');
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
    // Wraps all element with a form to comply with chrome guidelines
    <form>
      {/* Wrapper box */}
      <Box className='containerBox'>
        {/* Paper for shadow effect */}
        <Paper className='registerPaper'>
          <Typography variant='h5'>Sign up to Trackable</Typography>
          {/* Spacer box */}
          <Box className='spacerRegister' />
          {/* Grid to arrange components */}
          <Grid
            // Sets the the Grid as a container
            container
            // Sets the spacing between elements as 0
            spacing={0}
            // Sets the CSS class as nameGrid
            className='nameGrid'
          >
            {/* Grid cell */}
            <Grid item xs={5.7}>
              {/* First name input field */}
              <InputBase
                // Sets whether input is in error mode to hasError
                // hasError is in firstName dictionary inside the formValidationStatus state dictionary
                error={formValidationStatus.firstName.hasError}
                // Sets name as firstName
                name='firstName'
                // Sets id as firstName
                id='firstName'
                // Sets label as firstName
                label='firstname'
                // Sets CSS class as nameField
                className='nameField'
                // Text the is displayed before the user types in the field
                placeholder='first name'
                // Sets the autocomplete type for the browser
                autoComplete='given-name'
                // Run handleRegisterChange when the field input changes
                onChange={handleRegisterChange}
              />
            </Grid>
            {/* Spacer cell inbetween the two cells */}
            <Grid item xs />
            {/* Grid cell */}
            <Grid item xs={5.7}>
              {/* Last name input field */}
              <InputBase
                // Sets whether input is in error mode to hasError
                // hasError is in lastName dictionary inside the formValidationStatus state dictionary
                error={formValidationStatus.lastName.hasError}
                // Sets name to lastName
                name='lastName'
                // Sets id to lastName
                id='lastName'
                // Sets label to lastName
                label='lastName'
                // Sets CSS styles to nameField
                className='nameField'
                // Text the is displayed before the user types in the field
                placeholder='last name'
                // Sets the autocomplete type for the browser
                autoComplete='family-name'
                // Run handleRegisterChange when the field input changes
                onChange={handleRegisterChange}
              />
            </Grid>
          </Grid>
          {/* Input field from email */}
          <InputBase
            // Sets whether input is in error mode to hasError
            // hasError is in email dictionary inside the formValidationStatus state dictionary
            error={formValidationStatus.email.hasError}
            // Sets name to email
            name='email'
            // Sets id to email
            id='email'
            // Sets label to email
            label='email'
            // Sets CSS class to EmailField
            className='EmailField'
            // Text the is displayed before the user types in the field
            placeholder='jamesdoe@gmail.com'
            // Sets the autocomplete type for the browser
            autoComplete='email'
            // Run handleRegisterChange when the field input changes
            onChange={handleRegisterChange}
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
            // Sets name as password
            name='password'
            // Sets id as password
            id='password'
            // Sets CSS class as PasswordField
            className='PasswordField'
            // Text the is displayed before the user types in the field
            placeholder='password'
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
          {/* Hides and reveals the retype password element */}
          <Collapse
            // Sets retypePasswordStatus state to define whether the input field is visible
            in={retypePasswordStatus}
            // Sets the CSS class to createPasswordCollapse
            className='createPasswordCollapse'
          >
            {/* Container box for alignment */}
            <Box className='collapseBoxAlign' fullWidth>
              {/* Retype password input field */}
              <InputBase
                // Sets name to retypedPassword
                name='retypedPassword'
                // Sets id to retypedPassword
                id='retypedPassword'
                // Sets CSS class to PasswordField
                className='PasswordField'
                // Text the is displayed before the user types in the field
                placeholder='retype password'
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
            </Box>
          </Collapse>
          {/* Hides and reveals the error element */}
          <Collapse
            // Sets hasError value in passwordValidationStatus state to define whether error is visible
            in={passwordValidationStatus.hasError}
            // Sets CSS class to createPasswordCollapse
            className='createPasswordCollapse'
          >
            {/* Container box for alignment */}
            <Box className='collapseBoxAlign'>
              {/* Loops for all errors in errors array in passwordValidationStatus state */}
              {passwordValidationStatus.errors.map((error) => {
                // For each error a error element is rendered
                return (
                  // Error element
                  <Alert
                    // Sets the style to error
                    severity='error'
                    // Sets CSS class to passwordAlert
                    className='passwordAlert'
                  >
                    {error}
                  </Alert>
                );
              })}
            </Box>
          </Collapse>
          {/* Container box */}
          <Box width='80%'>
            {/* Sign up button */}
            <Button
              // Sets the style to contained
              variant='contained'
              // Sets the CSS class to registerRoundButton
              className='registerRoundButton'
              // Makes the button full width of the container box
              fullWidth
              // Runs handleSubmit on click
              onClick={handleSubmit}
            >
              SIGN UP
            </Button>
          </Box>
        </Paper>
      </Box>
    </form>
  );
}

// Exports Login
export default SignUp;
