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
import { TextField, Typography } from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// Import React Components
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Import Axios
import axios from 'axios';
import axiosInstance from '../Axios';

function Login() {
  let navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [inputData, updateInputData] = useState({
    email: '',
    password: '',
  });
  const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleShowPassword() {
    setPasswordVisibility(!passwordVisibility);
  }

  function handleLoginChange(e) {
    updateInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
    setInvalidEmailOrPassword(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post('http://127.0.0.1:8000/api/auth/token/', {
        client_id: process.env.REACT_APP_CLIENT_ID, // process.env.REACT_APP_CLIENTID
        grant_type: 'password',
        username: inputData.email,
        password: inputData.password,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          if (rememberMe) {
            localStorage.setItem(
              'access_token',
              response.data.access_token
            );
            localStorage.setItem(
              'refresh_token',
              response.data.refresh_token
            );
          } else {
            sessionStorage.setItem(
              'access_token',
              response.data.access_token
            );
            sessionStorage.setItem(
              'refresh_token',
              response.data.refresh_token
            );
          }
          navigate('/home', { replace: true });
        }
      })
      .then(() => {
        axiosInstance
          .get('user/id/')
          .then((response) => {
            localStorage.setItem('user_id', response.data[0].id);
          })
          .catch((error) => {
            if (
              error.response.data.detail ==
              'Invalid token header. No credentials provided.'
            ) {
              localStorage.setItem(
                'user_id',
                error.response.data.requestData.data[0].id
              );
            }
          });
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 400) {
          setInvalidEmailOrPassword(true);
        }
      });
  }

  function handleRememberMeChange(event) {
    setRememberMe(!rememberMe);
  }

  return (
    <form>
      <Box className='containerBox'>
        <Paper className='loginPaper'>
          <Typography variant='h5'>Login into your account </Typography>
          <Stack direction='row' spacing={0.5}>
            <Typography className='loginCreateAccountCaption'>
              Don't have an account yet?
            </Typography>
            <Typography component={Link} to='/signup' className='createOneLink'>
              Create one
            </Typography>
          </Stack>
          <Box fullWidth className='spacerLogin' />
          <InputBase
            error={invalidEmailOrPassword}
            name='email'
            id='email'
            label='email'
            className='EmailField'
            placeholder='jamesdoe@gmail.com'
            autoComplete='email'
            onChange={handleLoginChange}
            endAdornment={
              <InputAdornment position='end'>
                <EmailIcon color='visibilityOff' />
              </InputAdornment>
            }
          />
          <InputBase
            error={invalidEmailOrPassword}
            name='password'
            id='password'
            label='test'
            placeholder='password'
            className='PasswordField'
            type={passwordVisibility ? 'text' : 'password'}
            autoComplete='current-password'
            onChange={handleLoginChange}
            sx={{}}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleShowPassword}
                  edge='end'
                >
                  {passwordVisibility ? (
                    <VisibilityFilled color='visiblity' />
                  ) : (
                    <VisibilityOutlined color='visibilityOff' />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          <Collapse
            in={invalidEmailOrPassword}
            className='createPasswordCollapse'
          >
            <Box className='collapseBoxAlign'>
              <Alert severity='error' className='passwordAlert'>
                The email or password is invalid
              </Alert>
            </Box>
          </Collapse>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
            }
            label='Remember me'
          />
          <Box width='80%'>
            <Button
              variant='contained'
              className='loginRoundButton'
              fullWidth
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

export default Login;
