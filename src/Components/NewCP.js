// Import axios instance
import axiosInstance from '../Axios';
// Import redux component
import store from '../Store';
import { addCP } from '../Features/CPData';

// Function that handles creation of new client and projects
function handleNewCP(CPSelected, setCPSelected) {
  // If the client or project is new
  if (CPSelected.newValue == true) {
    // If it is a client
    if (CPSelected.type == 'client') {
      // Creates a new client with a post request
      axiosInstance
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
          // Sets the CPSelected states the new client's information
          setCPSelected(response.data);
          // Adds the new client to CPData redux state
          store.dispatch(addCP(response.data));
        })
        // Handles errors
        .catch((error) => {
          // If the access token is invalid
          if (
            error.response.data.detail ==
            'Invalid token header. No credentials provided.'
          ) {
            // Sets the CPSelected states the new client's information passed through by axios intercept
            setCPSelected(error.response.data.requestData.data);
            // Adds the new client passed through by axios intercept to CPData redux state
            store.dispatch(addCP(error.response.data.requestData.data));
          }
        });
      // If it is a project
    } else {
      // Creates a new project with a post request
      axiosInstance
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
          // Sets the CPSelected states the new project's information
          setCPSelected(response.data);
          // Adds the new project to CPData redux state
          store.dispatch(addCP(response.data));
        })
        // Handles errors
        .catch((error) => {
          // If the access token is invalid
          if (
            error.response.data.detail ==
            'Invalid token header. No credentials provided.'
          ) {
            // Sets the CPSelected states the new project's information passed through by axios intercept
            setCPSelected(error.response.data.requestData.data);
            // Adds the new project passed through by axios intercept to CPData redux state
            store.dispatch(addCP(error.response.data.requestData.data));
          }
        });
    }
  }
}

export default handleNewCP;
