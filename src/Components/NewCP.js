// Import axios instance
import axiosInstance from '../Axios';
// Import redux component
import store from '../Store';
import { addCP } from '../Features/CPData';

// The state CPSelected stateis not directly changed due to there being a delay causing the request to be made before the CPSelected can change

// Function that handles creation of new client and projects
async function handleNewCP(CPSelected) {
  // Create a variable to store the CP selected's data
  var data = CPSelected;

  // If the client or project is new
  if (CPSelected.newValue === true) {
    // If it is a client
    if (CPSelected.type === 'clients') {
      // Creates a new client with a post request
      // Data variable stores the new client data
      data = await axiosInstance
        .post('CRUD/clients/', {
          // Defines the body content
          // Sets name to the client name without ADD CLIENT:
          name: CPSelected.name.slice(12),
          // Gets the user id from local storage
          user: localStorage.getItem('user_id')
            ? localStorage.getItem('user_id')
            : sessionStorage.getItem('user_id'),
        })
        // Handles response
        .then((response) => {
          // Adds the new client to CPData redux state
          store.dispatch(addCP(response.data));
          // Returns the new client data
          return response.data;
        })
        // Handles errors
        .catch((error) => {
          // If the access token is invalid
          if (
            error.response.data.detail ===
            'Invalid token header. No credentials provided.'
          ) {
            // Adds the new client passed through by axios intercept to CPData redux state
            store.dispatch(addCP(error.response.data.requestData.data));
            // Returns the new client data passed through by axios intercept
            return error.response.data.requestData.data;
          }
        });
      // If it is a project
    } else {
      // Creates a new project with a post request
      // Data variable stores the new project data
      data = await axiosInstance
        .post('CRUD/projects/', {
          // Defines the body content
          // Sets name to the project name without ADD PROJECT:
          name: CPSelected.name.slice(13),
          // Gets the user id from local storage
          user: localStorage.getItem('user_id')
            ? localStorage.getItem('user_id')
            : sessionStorage.getItem('user_id'),
        })
        // Handles response
        .then((response) => {
          // Adds the new project to CPData redux state
          store.dispatch(addCP(response.data));
          // Returns the new project data
          return response.data;
        })
        // Handles errors
        .catch((error) => {
          // If the access token is invalid
          if (
            error.response.data.detail ===
            'Invalid token header. No credentials provided.'
          ) {
            // Adds the new project passed through by axios intercept to CPData redux state
            store.dispatch(addCP(error.response.data.requestData.data));
            // Returns the new project data passed through by axios intercept
            return error.response.data.requestData.data;
          }
        });
    }
  }

  // Returns the CP selected's data
  return data;
}

export default handleNewCP;
