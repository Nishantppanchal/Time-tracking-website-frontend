// Import the axios instance
import axiosInstance from '../Axios';
// Import redux component
import store from '../Store';
import { addTag } from '../Features/Tags';

// Function that extracts description and tags from mentions textfield data
async function handleDescriptionsAndTagsExtraction(
  data,
  setTagsSelected,
  setDescription,
  setDescriptionRaw
) {
  // Set the description state to the raw text
  setDescription(
    data.raw.blocks
      // Joins all the lines together into one line of text
      .map((line) => {
        return line.text;
      })
      .join(' ')
  );
  // Set the descriptionRaw state to stringified JS code
  setDescriptionRaw(JSON.stringify(data.raw));

  // Creates a variable that stores a array with all the newTags
  var newTags = [];
  // Creates a variable that stores a array with selected tags
  var tags = [];

  // loops for each tag in the tags in the textfield
  for (let tag of data.tags) {
    // If the tag has the key newValue set to true
    if (tag.newValue) {
      console.log(tag)
      // Get a get request to determine if the tag exists
      var doesTagExist = await axiosInstance
        .get('doesTagExist/', {
          // Add the parameter name to the url
          // Name would be the name of the tag with ADD TAG:
          params: { name: tag.name.slice(9) },
        })
        // Handle response to the get request
        .then((response) => {
          // Return the response data
          // This would be stored in doesTagExist
          return response.data;
        })
        // Handles errors
        .catch((error) => {
          // If access token is invalid
          if (
            error.response.data.detail ==
            'Invalid token header. No credentials provided.'
          ) {
            // Return the response data passed through by axios intercept
            // This would be stored in doesTagExist
            return error.response.data.requestData.data;
          }
        });

      // If the tag doesn't exist
      if (!doesTagExist.exists) {
        // Create a new tag with a post request
        var data = await axiosInstance
          .post('CRUD/tags/', {
            // Defines the body content of the post request
            // Sets the name to the tag name with ADD TAG:
            name: tag.name.slice(9),
            billable: tag.billable,
            // Get the user id from the local storage
            user: localStorage.getItem('user_id')
              ? localStorage.getItem('user_id')
              : sessionStorage.getItem('user_id'),
          })
          // Handles the response
          .then((response) => {
            // Return the response data
            // This would be stored in the variable data
            return response.data;
          })
          // Handles errors
          .catch((error) => {
            // If the access token is invalid
            if (
              error.response.data.detail ==
              'Invalid token header. No credentials provided.'
            ) {
              // Return the response data passed through by axios intercept
              // This would be stored in the variable data
              return error.response.data.requestData.data;
            }
          });

        // Add the new tag's ID to the tags array
        tags.push(data.id);
        // Add the new tag's data to the newTags array
        newTags.push(data);
        // Otherwise, if the new tag has already been created
      } else {
        // Add the new tag's ID to the tags array
        tags.push(data.id);
      }
      // Otherwise, if the tag is not a new tag
    } else {
      // Add the tag's ID to the tags array
      tags.push(tag.id);
    }
  }

  // Sets the tagsSelected state to the tags array
  setTagsSelected(tags);
  // If the newTags array is not empty
  if (newTags.length != 0) {
    // Add new tags to the tags redux state
    store.dispatch(addTag(newTags));
  }
}

// Export handleDescriptionAndTagsExtraction function
export default handleDescriptionsAndTagsExtraction;
