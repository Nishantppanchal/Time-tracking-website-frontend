// Import React components
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Import the axios instance
import axiosInstance from "../Axios";
// Import MUI components
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import AdapterLuxon from "@mui/lab/AdapterLuxon";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
// Import custom component
import DescriptionWithTagsInput from "./DescriptionWithTags";

function EditPage() {
  // Gets the id from the URL 
  const { id } = useParams();
  // Creates the function DateTime
  const { DateTime } = require("luxon");
  // Create a filter function
  const filter = createFilterOptions();
  // Creates a navigate function
  const navigate = useNavigate();

  // Defines all the states
  // The states are kept seperates as state are not update instantly
  // Hence seperation prevent update overides
    // Stores data from server
      // Stores log data
  const [logData, setLogData] = useState(null);
      // Stores clients and projects data
  const [CPData, setCPData] = useState([]);
      // Stores tags data
  const [tagsData, setTagsData] = useState([]);
    // Stores whether data has loaded or not
      // Stores whether logs have loaded
  const [isLogLoading, setIsLogLoading] = useState(true);
      // Stores whether the client and projects have loaded
  const [isCPDataLoading, setIsCPDataLoading] = useState(true);
      // Stores whether the tags have loaded
  const [isTagsDataLoading, setIsTagsDataLoading] = useState(true);
    // Stores values of component edited by the user in the browser
      // Stores the description in user readable format
  const [description, setDescription] = useState();
      // Stores the description as stringified JS code
  const [descriptionRaw, setDescriptionRaw] = useState();
      // Stores the tags the user has used in the description
  const [tagsSelected, setTagsSelected] = useState([]);
      // Stores the duration
  const [duration, setDuration] = useState();
      // Stores the client of project selected
  const [CPSelected, setCPSelected] = useState(null);
      // Stores input values of the client and project textfield
  const [inputValue, setInputValue] = useState();
      // Stores the date selected by the user
  const [date, setDate] = useState();
    // Stores whether there is a error
      // Stores where no fields have changed
  const [noFieldsChangedError, setNoFieldsChangedError] = useState(false);

  // Runs this code on every render/update after the DOM has updated if setLogData has changed
  useEffect(() => {
    // Creates the url with the ID of log
    const url = "CRUD/logs/" + id + "/";
    // Sends a get request to get the log
    axiosInstance
      .get(url)
      // Handles the response to the get request
      .then((response) => {
        // Add the log data to the logData state
        setLogData(response.data);
        // Set the isLogLoading state to false
        setIsLogLoading(false);
        // Sets the duration state to the duration in the log data
        setDuration(response.data.time);
        // Sets the date state to the date in the log data
        // The date is convert from string to a DateTime instance
        setDate(DateTime.fromFormat(response.data.date, "yyyy-LL-dd"));
      })
      // Handles errors
      .catch((error) => {
        // If the access token is invalid
        if (
          error.response.data.detail ==
          "Invalid token header. No credentials provided."
        ) {
          // Set the logData state to the log data passed through the error data by axios intercept
          setLogData(error.response.data.requestData.data);
          // Set the isLogLoading state to false
          setIsLogLoading(false);
          // Sets the duration state to the duration in the log data passed through the error data by axios intercept
          setDuration(error.response.data.requestData.data.time);
          // Sets the date state to the date in the log data passed through the error data by axio intercept
          // The date is convert from string to a DateTime instance
          setDate(
            DateTime.fromFormat(
              error.response.data.requestData.data.date,
              "yyyy-LL-dd"
            )
          );
        }
      });
  }, [setLogData]);

  // Runs this code on every render/update after the DOM has updated if setCPData has changed
  useEffect(() => {
    // Sends a get request to get the clients and projects
    axiosInstance
      .get("clientProjectGet/")
      // Handles the response to the request
      .then((response) => {
        // Set the CPData state to the response data
        setCPData(response.data);
        // Sets isCPDataLoading state to false
        setIsCPDataLoading(false);
      })
      // Handles error
      .catch((error) => {
        // If the access token is invalid
        if (
          error.response.data.detail ==
          "Invalid token header. No credentials provided."
        ) {
          // Sets the CPData state to the response data passed through the error data by axios intercept
          setCPData(error.response.data.requestData.data);
          // Sets isCPDataLoading state to false
          setIsCPDataLoading(false);
        }
      });
  }, [setCPData]);

  // Runs this code on every render/update after the DOM has updated if setTagsData has changed
  useEffect(() => {
    // Sends a get request to get the tags
    axiosInstance
      .get("CRUD/tags/")
      // Handles the response to the request
      .then((response) => {
        // Set the tagsData state to the response data
        setTagsData(response.data);
        // Set isTagDataLoading to false
        setIsTagsDataLoading(false);
      })
      // Handle error
      .catch((error) => {
        // If the access token is invalid
        if (
          error.response.data.detail ==
          "Invalid token header. No credentials provided."
        ) {
          // Set the tagsData state to the response data passed through the the error data by axios intercept 
          setTagsData([...error.response.data.requestData.data]);
          // Set isTagDataLoading to false
          setIsTagsDataLoading(false);
        }
      });
  }, [setTagsData]);

  // Runs this code on every render/update after the DOM has updated if CPData and logData has changed
  useEffect(() => {
    // If CPData is not empty and logData is not null and the client or project selected is not null
    if (CPData.length > 0 && logData != null && CPSelected == null) {
      // If the log is assigned to a client
      if (logData.client) {
        // Find the client data with it's ID
        const client = CPData.find(
          (data) => data.id == logData.client && data.type == "clients"
        );
        // Set the CPSelected state to the client data found
        setCPSelected(client);
      // If the log is assigned to a project
      } else {
        // Find the project data with it's ID
        const project = CPData.find(
          (data) => data.id == logData.project && data.type == "projects"
        );
        // Set the CPSelected state to the project data found
        setCPSelected(project);
      }
    }
  }, [CPData, logData]);

  // Handle change in the content within DescriptionWithTagsInput textfield
  async function handleDescriptionWithTagsData(data) {
    // Set the description state to the raw text
    setDescription(
      data.raw.blocks
        // Joins all the lines together into one line of text
        .map((line) => {
          return line.text;
        })
        .join(" ")
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
        // Get a get request to determine if the tag exists
        var doesTagExist = await axiosInstance
          .get("doesTagExist/", {
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
              "Invalid token header. No credentials provided."
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
            .post("CRUD/tags/", {
              // Defines the body content of the post request
              // Sets the name to the tag name with ADD TAG:
              name: tag.name.slice(9),
              billable: tag.billable,
              // Get the user id from the local storage
              user: localStorage.getItem("user_id"),
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
                "Invalid token header. No credentials provided."
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
      // Sets the tagsData state to a array combining the newTags array and the current tagsData array
      setTagsData([...newTags, ...tagsData]);
    }
  }

  // Handles duration change
  function handleDurationChange(event) {
    // Sets the duration state to the new duration value entered by the user
    setDuration(event.target.value);
  }

  // Handles date change
  function handleDateChange(newDate) {
    // If the date has changed
    if (newDate != date) {
      // Set the date state to the new date selected by the user
      setDate(newDate);
    }
  }

  // Handles when the update button is clicked
  function handleUpdateButton(event) {
    // Prevents the default actions
    event.preventDefault();

    // If the client or project is new
    if (CPSelected.newValue == true) {
      // If it is a client
      if (CPSelected.type == "client") {
        // Creates a new client with a post request
        axiosInstance
          .post("CRUD/clients/", {
            // Defines the body content
            // Sets name to the client name without ADD CLIENT:
            name: CPSelected.name.slice(12),
            // Gets the user id from local storage
            user: localStorage.getItem("user_id"),
          })
          // Handles response
          .then((response) => {
            // Sets the CPSelected states the new client's information
            setCPSelected(response.data);
            // Adds the new client to CPData state
            setCPData([response.data, ...CPData]);
          })
          // Handles errors
          .catch((error) => {
            // If the access token is invalid
            if (
              error.response.data.detail ==
              "Invalid token header. No credentials provided."
            ) {
              // Sets the CPSelected states the new client's information passed through by axios intercept
              setCPSelected(error.response.data.requestData.data);
              // Adds the new client passed through by axios intercept to CPData state
              setCPData([error.response.data.requestData.data, ...CPData]);
            }
          });
      // If it is a project
      } else {
        // Creates a new project with a post request
        axiosInstance
          .post("CRUD/projects/", {
            // Defines the body content
            // Sets name to the project name without ADD PROJECT:
            name: CPSelected.name.slice(13),
            // Gets the user id from local storage
            user: localStorage.getItem("user_id"),
          })
          // Handles response
          .then((response) => {
            // Sets the CPSelected states the new project's information
            setCPSelected(response.data);
            // Adds the new project to CPData state
            setCPData([response.data, ...CPData]);
          })
          // Handles errors
          .catch((error) => {
            // If the access token is invalid
            if (
              error.response.data.detail ==
              "Invalid token header. No credentials provided."
            ) {
              // Sets the CPSelected states the new project's information passed through by axios intercept
              setCPSelected(error.response.data.requestData.data);
              // Adds the new project passed through by axios intercept to CPData state
              setCPData([error.response.data.requestData.data, ...CPData]);
            }
          });
      }
    }

    // Creates the url with the ID of log
    const url = "CRUD/logs/" + id + "/";
    // Creates a variable updatedData that store a empty dictionary
    var updatedData = {};

    // If the duration has changed
    if (duration != logData.time) {
      // Set the new duration as the value for the key time in updatedData
      updatedData.time = duration;
    }
    // If the date has changed
    if (date.toFormat("yyyy-LL-dd") != logData.date) {
      // Set the new date as the value for the key date in updatedData
      updatedData.date = date.toFormat("yyyy-LL-dd");
    }
    // If the description has changed
    if (descriptionRaw != logData.descriptionRaw) {
      // All threes are changed as they are all linked
      // Set the new description as the value for the key description in updatedData
      updatedData.description = description;
      // Set the new descriptionRaw as the value for the key descriptionRaw in updatedData
      updatedData.descriptionRaw = descriptionRaw;
      // Set the new tags selected as the value for the key tags in updatedData
      updatedData.tags = tagsSelected;
    }

    // If the CPSelected is a client and it has changed
    if (CPSelected.type == "clients" && CPSelected.id != logData.client) {
      // Set the new client selected as the value for the key client in updatedData
      updatedData.client = CPSelected.id;
    // Otherwise, if the CPSelected is a project and it has changed
    } else if (
      CPSelected.type == "projects" &&
      CPSelected.id != logData.project
    ) {
      // Set the new project selected as the value for the key project in updatedData
      updatedData.project = CPSelected.id;
    }

    // If there is atleast 1 key-value pair in the updatedData dictionary
    if (Object.keys(updatedData).length > 0) {
      // Partial update the log
      axiosInstance
        .patch(url, updatedData)
        // Handles response
        .then((response) => {
          // Navigates the user back to the home page
          navigate("/home");
      });
    // Otherwise, if not changes have been made
    } else {
      // Set the noFieldChangedError state to true
      // This causes a error alert to appear
      setNoFieldsChangedError(true);
    }
  }

  // Handles filtering the client and project based on the input
  function filterOptions(options, params) {
    // Creates a array of filtered options based on the input
    const filtered = filter(options, params);

    // Extracts the string input value from params
    const { inputValue } = params;
    // If the input value is not empty
    if (inputValue !== "") {
      // Add a create new client option
      filtered.push({
        // Sets the name key to the 'ADD CLIENT: ' + input value 
        name: `ADD ClIENT: ${inputValue}`,
        // Sets the newValue key's value to true
        newValue: true,
        // Sets the type to clients for grouping
        type: "clients",
      });
      // Add a create new project option
      filtered.push({
        // Sets the name key to the 'ADD PROJECT: ' + input value 
        name: `ADD PROJECT: ${inputValue}`,
        // Sets the newValue key's value to true
        newValue: true,
        // Sets the type to projects for grouping
        type: "projects",
      });
    }

    // Returns the filtered options array
    return filtered;
  }

  // Handles value (what is output after client/project selected) change
  function handleAutocompleteValueChange(event, newValue) {
    // Sets the CPSelected state to the new client or project selected
    setCPSelected(newValue);
  }

  // Handles input value (what is the user inputs in the textfield) change
  function handleAutocompleteInputValueChange(event, newValue) {
    // Sets the inputValue state to the new input value
    setInputValue(newInputValue);
  }

  // Handles when the back button is clicked
  function handleBackButton(event) {
    // Prevents the default actions
    event.preventDefault();
    // Sends the url to the home page
    navigate('/home')
  }

  // If all the date loading states are false
  // This would mean all the data has loaded
  if (!isLogLoading && !isCPDataLoading && !isTagsDataLoading) {
    // This is the JSX will be rendered
    return (
      // Wrapper div
      <div>
        {/* Header with tag id */}
        <h1>Tag ID: {id}</h1>
        {/* Date picker */}
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            // Sets the label to Date
            label='Date'
            // Sets the value of the date field to the date state
            value={date}
            // Assign handleDateChange to be run on change by user
            onChange={handleDateChange}
            // Defines what is render as the input field
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        {/* Textfield for duration */}
        <TextField
          // Sets id to duration
          id='duration'
          // Sets label to duration
          label='DURATION'
          // Sets the varient/style to filled
          variant='filled'
          // Sets the width to 15%
          sx={{ width: "15%" }}
          // Assign handleDurationChange to be run on change by user
          onChange={handleDurationChange}
          // Sets the value of the textfield to the duration state
          value={duration}
        />
        {/* Client and project textfield with suggestions */}
        <Autocomplete
          // Sets id to CP
          id='CP'
          // Sets the possible inputs to CPData
          options={CPData}
          // Set the option selected value in the textfield to client/project's names
          getOptionLabel={(option) => option.name}
          // Group the options by whether they are clients or projects
          groupBy={(option) => option.type}
          // Sets the width to 30%
          sx={{ width: "30%" }}
          // Assigns filterOptions to filter the client and project based on the input
          filterOptions={filterOptions}
          // Defines what is render as the input field
          renderInput={(params) => (
            <TextField {...params} label='CLIENT OR PROJECT' variant='filled' />
          )}
          // Assign handleAutocompleteValueChange to be run on change of client or project selected
          onChange={handleAutocompleteValueChange}
          // Sets the value of the client or project selected to the CPSelected state
          value={CPSelected}
          // Assign handleAutocompleteInputValueChange to be run on change of input entered by the user
          onInputChange={handleAutocompleteInputValueChange}
          // Sets the input value to the state inputValue
          inputValue={inputValue}
        />
        {/* Custom field for description with tags */}
        <DescriptionWithTagsInput
          // Set initial of this component not to be empty
          empty={false}
          // Pass through all the tags
          tags={tagsData}
          // Assign handleDescriptionWithTagsData to be run to process the content in this component
          data={handleDescriptionWithTagsData}
          // Assign clear to null as field clearing is not required here
          clear={null}
          // Provides the initial state to the component
          intialField={logData.descriptionRaw}
        />
        {/* Update button */}
        <Button 
          // Sets the button variant to text
          variant='text' 
          // Assign handleUpdateButton to be run on click of the button
          onClick={handleUpdateButton}
        >
          UPDATE
        </Button>
        {/* Back button */}
        <Button
          // Sets the button variant to text
          variant='text'
          // Assign handleBackButton to be run on click of the button
          onClick={handleBackButton}
        >
          BACK
        </Button>
        {/* No fields changed error alert */}
        <Collapse
          // Direction the componets would close and open
          orientation='vertical'
          // Set noFieldChangedError state as whether the alert is visible or not
          in={noFieldsChangedError}
          // Sets the width to 40%
          sx={{ width: "40%" }}
        >
          {/* Red alert component itself */}
          <Alert severity='error'>No fields changed</Alert>
        </Collapse>
      </div>
    );
  // Otherwise if all the data has not loaded yet
  } else {
    // Display a loading animation
    return <Skeleton />;
  }
}

// Exports editPage
export default EditPage;
