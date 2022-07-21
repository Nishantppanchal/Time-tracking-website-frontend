import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { baseURL } from '../Axios';
import { loginMethodStates, setLoginMethod } from '../Features/LoginMethod';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Icon } from '@mui/material';
import getTheme from './GetTheme';
import googleIcon from '../SVG/GoogleIcon.svg';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton(props) {
  const styles = props.sx ?? {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSuccess(response) {
    console.log(response);
    dispatch(setLoginMethod(loginMethodStates.google));

    axios
      .post(baseURL + 'auth/convert-token/', {
        // Get the client id from the .env file
        client_id: process.env.REACT_APP_DJANGO_CLIENT_ID,
        // Sets the grant type to password
        grant_type: 'convert_token',
        backend: 'google-oauth2',
        token: response.access_token,
      })
      .then((response) => {
        console.log(response);
        // Set the access token in localStorage
        // Under the name access_token
        localStorage.setItem('access_token', response.data.access_token);
        // Set the refresh token in localStorage
        // Under the name refresh_token
        localStorage.setItem('refresh_token', response.data.refresh_token);

        // Pushes the user to the dashboard page
        // Replace prevent the user from going back to the login page
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function handleError(error) {
    console.log(error);
  }

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
    flow: 'implicit',
  });

  return (
    <Button
      variant='contained'
      sx={{
        bgcolor: 'white',
        border: 1,
        borderColor: 'grey.400',
        '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.200' },
        ...styles,
      }}
      onClick={login}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <img
          src={googleIcon}
          alt='Google Icon'
          style={{ height: '1.5rem', aspectRatio: 1, paddingRight: '1em' }}
        />
        <div>{`${props.signUp ? 'SIGN UP' : 'SIGN IN'} WITH GOOGLE`}</div>
      </div>
    </Button>
  );
}

export default GoogleLoginButton;
