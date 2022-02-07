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
    // Passes back the response to axiosInstance
    return response;
  },
  // Handles errors
  async function (error) {
    // If the access token is expired
    if (
      error.response.data.detail ===
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
        // Handles reseponse
        .then((response) => {
          // Stores the new refresh and access token in the appropriate location
          if (localStorage.getItem('refresh_token')) {
            // Stores the access and refresh token to local storage
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
          } else {
            // Stores the access and refresh token to session storage
            sessionStorage.setItem('access_token', response.data.access_token);
            sessionStorage.setItem('refresh_token', response.data.refresh_token);
          }

          // Changes the access token in the header of the axiosInstance
          axiosInstance.defaults.headers['Authorization'] =
            'Bearer ' + response.data.access_token;
          // Changes the access token in the header of the original request
          originalRequest.headers['Authorization'] =
            'Bearer ' + response.data.access_token;
        })
        .then(async () => {
          // Resends orignial request and return the response to the const data
          const data = await axiosInstance(originalRequest);
          return data;
        })
        // Handles errors
        .catch((error) => {
          // If the refresh token is expired
          if (error.response.data.error === 'invalid_grant') {
            // Removes the access and refresh token from the appropriate location
            if (localStorage.getItem('refresh_token')) {
              // Remove access and refresh token from local storage
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            } else {
              // Remove access and refresh token from session storage
              sessionStorage.removeItem('access_token');
              sessionStorage.removeItem('refresh_token');
            }
            
            // Redirects user to login in pages (cause reload but navigate can't be used)
            window.location.href = '/login/';
          }
        });

      // Adds the data returned by the original request to the error data
      error.response.data.requestData = data;
      // Pass back the error to axiosInstance 
      return Promise.reject(error);
    }

    // Pass back the error to axiosInstance
    return Promise.reject(error);
  }
);

// Exports axiosInstance
export default axiosInstance;
