import axios from 'axios';
import store from '../Store';
import axiosInstance, { baseURL } from '../Axios';
import { loginMethodStates, setLoginMethod } from '../Features/LoginMethod';

function LoginRequest(
  inputData,
  rememberMe,
  setInvalidEmailOrPassword,
  navigate
) {
  return (
    // Post user login info
    axios
      .post(baseURL + 'auth/token/', {
        // Get the client id from the .env file
        client_id: process.env.REACT_APP_DJANGO_CLIENT_ID,
        // Sets the grant type to password
        grant_type: 'password',
        // Sets the email as the username
        username: inputData.email.toLowerCase(),
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
            console.error(error.response.data);
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

              // Pushes the user to the dashboard page
              // Replace prevent the user from going back to the login page
              navigate('/dashboard', { replace: true });
            }
          });

        store.dispatch(setLoginMethod(loginMethodStates.trackable));
      })
      // Handles errors
      .catch((error) => {
        console.error(error.response.data);
        // If the error's status code is 400
        if (error.response.status === 400) {
          // Set the invalidEmailOrPassword to true
          // This cause an error prompt
          setInvalidEmailOrPassword(true);
        }
      })
  );
}

export default LoginRequest;
