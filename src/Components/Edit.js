/* eslint-disable react-hooks/exhaustive-deps */
// Import React components
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import the axios instance
import axiosInstance from '../Axios';
// Import MUI components
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import DoneIcon from '@mui/icons-material/Done';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
// Import custom component
import DescriptionWithTagsInput from './DescriptionWithTags';
import handleDescriptionsAndTagsExtraction from './DescriptionsAndTagsExtraction';
import handleNewCP from './NewCP';
import CPFilter from './CPFilter';
import Header from './Header';
// Import fetch components
import fetchCPData from './LoadData/LoadCPData';
import fetchTagsData from './LoadData/LoadTags';
// Import redux components
import { useSelector } from 'react-redux';

function EditPage() {
  // Gets the id from the URL
  const { id } = useParams();
  // Creates the function DateTime
  const { DateTime } = require('luxon');
  // Creates a navigate function
  const navigate = useNavigate();

  // Defines all the states
  // The states are kept seperates as state are not update instantly
  // Hence seperation prevent update overides
  // Stores data from server
  // Stores log data
  const [logData, setLogData] = useState(null);
  // Gets the CPData redux data to store clients and projects data
  const CPData = useSelector((state) => state.CPData.value);
  // Gets the tags redux data to store tags data
  const tagsData = useSelector((state) => state.tags.value);
  // Stores whether data has loaded or not
  // Stores whether logs have loaded
  const [isLogLoading, setIsLogLoading] = useState(true);
  // Stores whether all the clients and projects have loaded
  const [isCPDataLoading, setIsCPDataLoading] = useState(
    // If CPData is not empty make it false, else make it true
    CPData.length > 0 ? false : true
  );
  // Stores whether all the tags have loaded
  const [isTagsDataLoading, setIsTagsDataLoading] = useState(
    // If tagsData is not empty make it false, else make it true
    tagsData.length > 0 ? false : true
  );
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
    const url = 'CRUD/logs/' + id + '/';
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
        setDate(DateTime.fromFormat(response.data.date, 'yyyy-LL-dd'));
      })
      // Handles errors
      .catch((error) => {
        // If the access token is invalid
        if (
          error.response.data.detail ===
          'Invalid token header. No credentials provided.'
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
              'yyyy-LL-dd'
            )
          );
        }
      });
  }, []);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If the CPData has not loaded yet
    if (isCPDataLoading === true) {
      // Runs the function that fetches the CPData
      fetchCPData(setIsCPDataLoading);
      // Otherwise, if the CPData has already been loaded
    }
  }, []);

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    // If tags have not loaded yet
    if (isTagsDataLoading) {
      // Runs the function that fetches the tags
      fetchTagsData(setIsTagsDataLoading);
      // Otherwise, if the tags have not already been loaded
    }
  }, []);

  // Runs this code on every render/update after the DOM has updated if CPData and logData has changed
  useEffect(() => {
    // If CPData is not empty and logData is not null and the client or project selected is not null
    if (CPData.length > 0 && logData != null && CPSelected == null) {
      // If the log is assigned to a client
      if (logData.client) {
        // Find the client data with it's ID
        const client = CPData.find(
          (data) => data.id === logData.client && data.type === 'clients'
        );
        // Set the CPSelected state to the client data found
        setCPSelected(client);
        // If the log is assigned to a project
      } else {
        // Find the project data with it's ID
        const project = CPData.find(
          (data) => data.id === logData.project && data.type === 'projects'
        );
        // Set the CPSelected state to the project data found
        setCPSelected(project);
      }
    }
  }, [CPData, logData]);

  // Handle change in the content within DescriptionWithTagsInput textfield
  function handleDescriptionWithTagsData(data) {
    // Handles the description and tags extraction
    // The required values and functions are pass through
    handleDescriptionsAndTagsExtraction(
      data,
      setTagsSelected,
      setDescription,
      setDescriptionRaw
    );
  }

  // Handles duration change
  function handleDurationChange(event) {
    // If the duration has changed
    if (event.target.value !== duration) {
      // Sets the duration state to the new duration value entered by the user
      setDuration(event.target.value);
    }
  }

  // Handles date change
  function handleDateChange(newDate) {
    // If the date has changed
    if (newDate !== date) {
      // Set the date state to the new date selected by the user
      setDate(newDate);
    }
  }

  // Handles when the update button is clicked
  async function handleUpdateButton(event) {
    // Prevents the default actions
    event.preventDefault();

    // Runs function that handles creation of new clients and projects
    // The required states and setState functions are passed through
    // The response client or project data is stored in createdCPData
    const CPSelectedData = await handleNewCP(CPSelected);

    // Creates the url with the ID of log
    const url = 'CRUD/logs/' + id + '/';
    // Creates a variable updatedData that store a empty dictionary
    var updatedData = {};

    // If the duration has changed
    if (duration !== logData.time) {
      // Set the new duration as the value for the key time in updatedData
      updatedData.time = duration;
    }
    // If the date has changed
    if (date.toFormat('yyyy-LL-dd') !== logData.date) {
      // Set the new date as the value for the key date in updatedData
      updatedData.date = date.toFormat('yyyy-LL-dd');
    }
    // If the description has changed
    if (descriptionRaw !== logData.descriptionRaw) {
      // All threes are changed as they are all linked
      // Set the new description as the value for the key description in updatedData
      updatedData.description = description;
      // Set the new descriptionRaw as the value for the key descriptionRaw in updatedData
      updatedData.descriptionRaw = descriptionRaw;
      // Set the new tags selected as the value for the key tags in updatedData
      updatedData.tags = tagsSelected;
    }

    // If the CPSelected is a client and it has changed
    if (
      CPSelectedData.type === 'clients' &&
      CPSelectedData.id !== logData.client
    ) {
      // Set the new client selected as the value for the key client in updatedData
      updatedData.client = CPSelectedData.id;
      // Otherwise, if the CPSelected is a project and it has changed
    } else if (
      CPSelectedData.type === 'projects' &&
      CPSelectedData.id !== logData.project
    ) {
      // Set the new project selected as the value for the key project in updatedData
      updatedData.project = CPSelectedData.id;
    }

    // If there is atleast 1 key-value pair in the updatedData dictionary
    if (Object.keys(updatedData).length > 0) {
      // Partial update the log
      axiosInstance
        .patch(url, updatedData)
        // Handles response
        .then(() => {
          // Navigates the user back to the dashboard page
          navigate('/dashboard');
        });
      // Otherwise, if not changes have been made
    } else {
      // Set the noFieldChangedError state to true
      // This causes a error alert to appear
      setNoFieldsChangedError(true);
    }
  }

  // Handles value (what is output after client/project selected) change
  function handleAutocompleteSelectedChange(event, newValue) {
    // Sets the CPSelected state to the new client or project selected
    setCPSelected(newValue);
  }

  // Handles input value (what is the user inputs in the textfield) change
  function handleAutocompleteInputValueChange(event, newInputValue) {
    // Sets the inputValue state to the new input value
    setInputValue(newInputValue);
  }

  // Handles when the back button is clicked
  function handleBackButton(event) {
    // Prevents the default actions
    event.preventDefault();
    // Sends the url to the dashboard page
    navigate('/dashboard');
  }

  // If all the date loading states are false
  // This would mean all the data has loaded
  if (!isLogLoading && !isCPDataLoading && !isTagsDataLoading) {
    // This is the JSX will be rendered
    return (
      // Wrapper div
      <div>
        {/* App bar */}
        <Header />
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
          sx={{ width: '15%' }}
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
          sx={{ width: '30%' }}
          // Assigns filterOptions to a function that filter the client and project based on the input
          filterOptions={CPFilter}
          // Defines what is render as the input field
          renderInput={(params) => (
            <TextField {...params} label='CLIENT OR PROJECT' variant='filled' />
          )}
          // Assign handleAutocompleteSelectedChange to be run on change of client or project selected
          onChange={handleAutocompleteSelectedChange}
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
          // Sets readOnly to false so user can edit the description
          readOnly={false}
        />
        {/* Update button */}
        <Button
          // Sets the button variant to text
          variant='contained'
          // Assign handleUpdateButton to be run on click of the button
          onClick={handleUpdateButton}
          // Add a button to the start of the icon
          startIcon={<DoneIcon />}
        >
          UPDATE
        </Button>
        {/* Back button */}
        <Button
          // Sets the button variant to text
          variant='contained'
          // Assign handleBackButton to be run on click of the button
          onClick={handleBackButton}
          // Add a button to the start of the icon
          startIcon={<ArrowLeftIcon />}
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
          sx={{ width: '40%' }}
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

// Exports EditPage
export default EditPage;
