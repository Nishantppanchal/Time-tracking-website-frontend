// Import redux component
import store from '../../Store';
import { loadCPData } from '../../Features/CPData';
// Import the axios instance
import axiosInstance from '../../Axios';

// Function that fetch client and project data
function fetchCPData(setIsCPDataLoading) {
  // Sends a get request to get the clients and projects
  axiosInstance
    .get('clientProjectGet/')
    // Handles the response to the request
    .then((response) => {
      // Set the CPData redux state to the response data
      store.dispatch(loadCPData(response.data));
      // Sets isCPDataLoading state to false
      setIsCPDataLoading(false);
    })
    // Handles error
    .catch((error) => {
      // If the access token is invalid
      if (
        error.response.data.detail ==
        'Invalid token header. No credentials provided.'
      ) {
        // Sets the CPData state to the response data passed through the error data by axios intercept
        store.dispatch(loadCPData(error.response.data.requestData.data));
        // Sets isCPDataLoading state to false
        setIsCPDataLoading(false);
      }
    });
}

// Export the fetchCPData
export default fetchCPData;
