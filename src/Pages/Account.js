import {
  Button,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '../Axios';
import Header from '../Components/Header';
import passwordValidator, { errorsText } from '../Components/PasswordValidator';

function Account() {
  const [accountDetails, setAccountDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [originalAccountDetails, setOriginalAccountDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [typedPasswordErrors, setTypedPasswordErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [typedPasswordAchieved, setTypedPasswordAchieved] = useState([]);
  const [errorColours, setErrorColours] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('user/id/')
      .then((response) => {
        setAccountDetails({ ...response.data[0] });
        setOriginalAccountDetails({ ...response.data[0] });
        console.log(response.data);
      })
      .catch((error) => {
        // If the access token is invalid
        if (
          error.response.data.detail ===
          'Invalid token header. No credentials provided.'
        ) {
          setAccountDetails({ ...error.response.data.requestData.data[0] });
          setOriginalAccountDetails({
            ...error.response.data.requestData.data[0],
          });
        }
      });
  }, []);

  useMemo(() => {
    const errors = [...errorsText];
    errors.pop();
    setPasswordErrors(errors);
  }, []);

  useEffect(() => {
    console.log(typedPasswordAchieved);
    const coloursArray = passwordErrors.map((error) => {
      if (typedPasswordErrors.includes(error)) {
        return '#ff5252';
      } else if (typedPasswordAchieved.includes(error)) {
        return '#81c784';
      }
      return 'text.primary';
    });
    console.log(coloursArray);
    setErrorColours(coloursArray);
  }, [newPassword]);

  function handleChangePasswordSubmit(event) {
    event.preventDefault();

    axiosInstance.post('user/change-password/', {
      new_password: newPassword,
    });
  }

  function handleNewPasswordChange(event) {
    setNewPassword(event.target.value);

    var errors = [];
    var achieved = [];
    if (event.target.value.length > 0) {
      errors = passwordValidator(event.target.value);
      achieved = passwordErrors.filter((error) => !errors.includes(error));
    }
    setTypedPasswordErrors(errors);
    setTypedPasswordAchieved(achieved);
    console.log(typedPasswordAchieved.length);
  }

  function handleAccountDetailsChange(event) {
    setAccountDetails({
      ...accountDetails,
      [event.target.id]: event.target.value,
    });

    setEmailAlreadyUsed(false);
  }

  function handleUpdateAccountDetails(event) {
    event.preventDefault();
    axiosInstance
      .patch('user/update/', accountDetails)
      .then((response) => {
        console.log(response);
        if (
          response.data.email[0] === 'users with this email already exists.'
        ) {
          setEmailAlreadyUsed(true);
        } else {
          setEmailAlreadyUsed(false);
        }
      })
      .catch((error) => {
        console.log(error.response.data.requestData.data.email[0]);
        if (
          error.response.data.detail ===
          'Invalid token header. No credentials provided.'
        ) {
          if (
            error.response.data.requestData.data.email[0] ===
            'users with this email already exists.'
          ) {
            setEmailAlreadyUsed(true);
          } else {
            setEmailAlreadyUsed(false);
          }
        }
      });
  }

  function isObjectsEqual(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);

    var equal = true;
    obj1Keys.forEach((key) => {
      if (obj1[key] !== obj2[key]) {
        equal = false;
      }
    });

    return equal;
  }

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} padding='3rem'>
        <Grid item xs={12}>
          <Typography variant='h6' width='100%' align='center'>
            EDIT ACCOUNT
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='first_name'
            onChange={handleAccountDetailsChange}
            variant='outlined'
            label='FIRST NAME'
            value={accountDetails.first_name}
            fullWidth
            autoComplete='given-name'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='last_name'
            onChange={handleAccountDetailsChange}
            variant='outlined'
            label='LAST NAME'
            value={accountDetails.last_name}
            fullWidth
            autoComplete='family-name'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='email'
            onChange={handleAccountDetailsChange}
            variant='outlined'
            label='EMAIL'
            value={accountDetails.email}
            fullWidth
            error={emailAlreadyUsed}
            helperText={
              emailAlreadyUsed
                ? 'There already exists a account using this email'
                : ''
            }
            autoComplete='email'
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              onClick={handleUpdateAccountDetails}
              disabled={isObjectsEqual(accountDetails, originalAccountDetails)}
            >
              UPDATE
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' width='100%' align='center'>
            PASSWORD
          </Typography>
        </Grid>
        <Grid item container xs={12} direction='row' spacing={2}>
          <Grid item xs>
            <TextField
              onChange={handleNewPasswordChange}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs='auto'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                width: '100%',
              }}
            >
              <Button
                variant='contained'
                onClick={handleChangePasswordSubmit}
                disabled={
                  typedPasswordAchieved.length !== passwordErrors.length
                }
              >
                CHANGE PASSWORD
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography>Password Rules:</Typography>
            <Box paddingLeft={4}>
              <ul>
                {passwordErrors.map((error, index) => {
                  return (
                    <li>
                      <Typography color={errorColours[index]}>
                        {error}
                      </Typography>
                    </li>
                  );
                })}
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Account;
