// Import Axios for queries to restful API
import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  // Set base url
  baseURL: 'http://127.0.0.1:8000/api/',
  // Set timeout to 10 seconds for the server end
  timeout: 1000,
  // Sets headers of request
  headers: {
    // Add tokens to requests
    Authorization:
      'Bearer ' +
      // Get the tokens from their appropriate location
      (localStorage.getItem('access_token')
        ? localStorage.getItem('access_token')
        : sessionStorage.getItem('access_token')),
    // Tells the server the content format of the data
    'Content-Type': 'application/json',
    // Tells the server what format response is accepted
    accept: 'application/json',
  },
});

// Intercepts response for all requests made using the axios instance axiosInstance
axiosInstance.interceptors.response.use(
  // Handles response on no error
  function (response) {
    // Passes back the response to the axiosInstance
    return response;
  },
  // Handles errors
  async function (error) {
    // If the access token is expired
    if (
      error.response.data.detail ==
      'Invalid token header. No credentials provided.'
    ) {
      // Creates a variable to store refresh token
      var refreshToken = null;
      // Get original request to rerun
      const originalRequest = error.config;

      // Get the refresh token from the appropriate location
      if (localStorage.getItem('refresh_token')) {
        // Gets the refresh token from local storage
        refreshToken = localStorage.getItem('refresh_token');
      } else {
        // Gets the refresh token from session storage
        refreshToken = sessionStorage.getItem('refresh_token');
      }

      // Requests a new access token using the refresh token
      const data = await axios
        .post('http://127.0.0.1:8000/api/auth/token/', {
          // Sets the require body fields
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
          // Gets client ID from .env file
          client_id: process.env.REACT_APP_CLIENT_ID,
        })
        .then((response) => {
          if (localStorage.getItem('refresh_token')) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
          } else {
            sessionStorage.setItem('access_token', response.data.access_token);
            sessionStorage.setItem(
              'refresh_token',
              response.data.refresh_token
            );
          }

          axiosInstance.defaults.headers['Authorization'] =
            'Bearer ' + response.data.access_token;
          originalRequest.headers['Authorization'] =
            'Bearer ' + response.data.access_token;
        })
        .then(async () => {
          const data = await axiosInstance(originalRequest);
          return data; // Gets original request to rerun
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.data.error == 'invalid_grant') {
            if (localStorage.getItem('refresh_token')) {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            } else {
              sessionStorage.removeItem('access_token');
              sessionStorage.removeItem('refresh_token');
            }
            window.location.href = '/login/';
          }
        });

      error.response.data.requestData = data;
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
