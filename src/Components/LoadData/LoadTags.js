// Import redux component
import store from '../../Store';
import { loadTags } from '../../Features/Tags';
// Import the axios instance
import axiosInstance from '../../Axios';

// Function that fetchs tag data
function fetchTagsData(setIsTagsDataLoading) {
  // Sends a get request to get the tags
  axiosInstance
    .get('CRUD/tags/')
    // Handles the response to the request
    .then((response) => {
      // Set the tags redux state to the response data
      store.dispatch(loadTags(response.data));
      // Set isTagDataLoading to false
      setIsTagsDataLoading(false);
    })
    // Handle error
    .catch((error) => {
      // If the access token is invalid
      if (
        error.response.data.detail ==
        'Invalid token header. No credentials provided.'
      ) {
        // Set the tags redux state to the response data passed through the the error data by axios intercept
        store.dispatch(loadTags(error.response.data.requestData.data));
        // Set isTagDataLoading to false
        setIsTagsDataLoading(false);
      }
    });
}

// Export fetchTagsData function
export default fetchTagsData;
