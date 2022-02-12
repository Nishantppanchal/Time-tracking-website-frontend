// Import the axios instance
import axiosInstance from '../../Axios';
// Import redux component
import store from '../../Store';
import { addLog, setAllLogsLoaded } from '../../Features/Logs';

// Function that fetchs the logs
// The required values and functions are passed through
function fetchLogs(loadingState) {
  // Gets redux state
  const state = store.getState();
  const loadedLogsNumber = state.logs.value.loadedLogsNumber;

  // Send the a get request to get the logs
  // loadedLogNumber allows the logs to be progressively loaded
  // As the user want more logs, the number increase, causing the next set of logs to be returned
  axiosInstance
    .get('CRUD/logs/', { params: { number: loadedLogsNumber } })
    // Handles the response
    .then((response) => {
      // If there is one or more logs in the response data
      if (response.data.length > 0) {
        // Adds the reponse data to logs array in the logs redux state
        store.dispatch(addLog(response.data));
        // If there are no logs in the response data
      } else {
        // Set allLogsLoaded in logs redux state to true
        // Cause the the load more button to be disabled
        store.dispatch(setAllLogsLoaded(true));
      }

      // Set isLogDataLoading to false
      // This tells the application that the logs loaded
      loadingState(false);
    })
    // Handles errors
    .catch((error) => {
      // If the access token is invalid
      if (
        error.response.data.detail ===
        'Invalid token header. No credentials provided.'
      ) {
        // If there are one or more logs in the response data passed through by axios intercept
        if (error.response.data.requestData.data.length > 0) {
          // Adds the reponse data to logs array in the logs redux state
          store.dispatch(addLog(error.response.data.requestData.data));
          // If there are no logs in the response data passed through by axios intercept
        } else {
          // Set allLogsLoaded in logs redux state to true
          // Cause the the load more button to be disabled
          store.dispatch(setAllLogsLoaded(true));
        }

        // Set isLogDataLoading to false
        // This tells the application that the logs loaded
        loadingState(false);
      }
    });
}

// Export fetchLogs function
export default fetchLogs;
