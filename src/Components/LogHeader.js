// Import MUI components
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// Import custom component
import DescriptionWithTagsInput from './DescriptionWithTags';
import handleNewCP from './NewCP';
import CPFilter from './CPFilter';
import handleDescriptionsAndTagsExtraction from './DescriptionsAndTagsExtraction';
// Import axios instance
import axiosInstance from '../Axios';
// Import redux components
import { useSelector, useDispatch } from 'react-redux';
import { addLog } from '../Features/Logs';
// Import React components
import { useState } from 'react';
// Import luxon component
import { DateTime } from 'luxon';

function LogHeader(props) {
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();

  // Defines all the states
  // Stores data from server
  // Stores tags
  const tagsData = useSelector((state) => state.tags.value);
  // Stores clients and projects data
  const CPData = useSelector((state) => state.CPData.value);
  // Stores the values in fields
  // Stores the value in the date field with the initial value as date time now
  const [date, setDate] = useState(DateTime.now());
  // Stores the client or project selected
  const [CPSelected, setCPSelected] = useState(null);
  // Stores the duration
  const [duration, setDuration] = useState('');
  // Stores the raw description data
  const [descriptionRaw, setDescriptionRaw] = useState();
  // Stores the tags selected
  const [tagsSelected, setTagsSelected] = useState([]);
  // The value inputed by the user in the client and project selection field
  const [inputValue, setInputValue] = useState('');
  // Other
  // Stores the current date tab the user is on
  const [currentTab, setCurrentTab] = useState(2);
  // Allow field clearing on value change
  const [clearField, setClearField] = useState(true);

  // Handles tab changing
  function handleTabChange(event, newTab) {
    // Sets the currentTab state to the new tab
    setCurrentTab(newTab);
    // If the newTab is the first tab
    if (newTab === 0) {
      // Sets the date state to 2 days minus the date today
      setDate(DateTime.now().plus({ days: -2 }));
      // If the newTab is the second tab
    } else if (newTab === 1) {
      // Sets the date state to 1 days minus the date today
      setDate(DateTime.now().plus({ days: -1 }));
      // If the newTab is the third tab
    } else if (newTab === 2) {
      // Sets the date state to today's date
      setDate(DateTime.now());
    }
  }

  // Handles the date change using the date picker
  function handleDateChange(newDate) {
    // If the date has changed
    if (newDate !== date) {
      // Set the date state to the nee date
      setDate(newDate);
    }
  }

  // Handles duration change
  function handleDurationChange(event) {
    // Sets the duration to the new duration value
    setDuration(event.target.value);
  }

  // Handle change in the content within DescriptionWithTagsInput textfield
  async function handleDescriptionWithTagsData(data) {
    // Handles the description and tags extraction
    // The required values and functions are pass through
    handleDescriptionsAndTagsExtraction(
      data,
      setTagsSelected,
      setDescriptionRaw
    );
  }

  // Handles log button click
  async function handleLogButton(event) {
    // Prevents default action on click of button
    event.preventDefault();

    // Runs function that handles creation of new clients and projects
    // The required states and setState functions are passed through
    // The response client or project data is stored in createdCPData
    const CPSelectedData = await handleNewCP(CPSelected);

    // If the client or project selected is a client
    if (CPSelectedData.type === 'clients') {
      // Sends a post request to create a new log
      axiosInstance
        .post('CRUD/logs/', {
          // Sets the required fields
          // Sets the time field
          time: duration,
          // Sets the date field after formatting the date
          date: date.toFormat('yyyy-LL-dd'),
          // Sets descriptionRaw which stores the raw js code for the description field
          descriptionRaw: descriptionRaw,
          // Sets the selected tags
          tags: tagsSelected,
          // Sets the client selected
          client: CPSelectedData.id,
          // Sets the user ID from it appropriate location
          user: localStorage.getItem('user_id')
            ? localStorage.getItem('user_id')
            : sessionStorage.getItem('user_id'),
        })
        // Handles the response
        .then((response) => {
          // Adds the new log to logData
          dispatch(addLog([response.data]));
        })
        // Handles errors
        .catch((error) => {
          console.log(error.response.data);
          // If the access token is invalid
          if (
            error.response.data.detail ===
            'Invalid token header. No credentials provided.'
          ) {
            // The response data passed through by axios intercept is added to logData
            dispatch(addLog([error.response.data.requestData.data]));
          }
        });
      // If the client or project selected is a project
    } else {
      axiosInstance
        .post('CRUD/logs/', {
          // Sets the required fields
          // Sets the time field
          time: duration,
          // Sets the date field after formatting the date
          // Sets descriptionRaw which stores the raw js code for the description field
          descriptionRaw: descriptionRaw,
          // Sets the selected tags
          tags: tagsSelected,
          // Sets the client selected
          project: CPSelectedData.id,
          // Sets the user ID from it appropriate location
          user: localStorage.getItem('user_id')
            ? localStorage.getItem('user_id')
            : sessionStorage.getItem('user_id'),
        })
        // Handles the response
        .then((response) => {
          // Adds the new log to logData
          dispatch(addLog([response.data]));
        })
        // Handles errors
        .catch((error) => {
          // If the access token is invalid
          if (
            error.response.data.detail ===
            'Invalid token header. No credentials provided.'
          ) {
            // The response data passed through by axios intercept is added to logData
            dispatch(addLog([error.response.data.requestData.data]));
          }
        });
    }

    // Resets all the logHeader fields
    // Clears duration field
    setDuration('');
    // Clears client or project selection field
    setCPSelected(null);
    setInputValue('');
    // Clears the description field
    setClearField(!clearField);
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

  // This is the JSX code rendered
  return (
    // Wrapper paper component
    <Paper>
      {/* Wrapper box component from tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* Tab selection UI */}
        <Tabs
          // Sets current tab to the currentTab state
          value={currentTab}
          // Runs the handleTabChange function when the tab is changed
          onChange={handleTabChange}
          aria-label='Date'
        >
          {/* Tab for two days ago */}
          <Tab
            label={
              // Generates two days ago text
              DateTime.now().plus({ days: -2 }).monthShort +
              ' ' +
              DateTime.now().plus({ days: -2 }).day
            }
          />
          {/* Tab for one day ago */}
          <Tab
            label={
              // Generates one day ago text
              DateTime.now().plus({ days: -1 }).monthShort +
              ' ' +
              DateTime.now().plus({ days: -1 }).day
            }
          />
          {/* Tab for today */}
          <Tab label='Today' />
          {/* Tab for custom date */}
          <Tab label='Custom Date' />
        </Tabs>
      </Box>
      {/* Collapse component to hide date picker */}
      <Collapse
        // Sets the the collapse animation direction to vertical
        orientation='vertical'
        // Date picker only visible if currentTab is the fourth tab
        in={currentTab === 3 ? true : false}
        sx={{ width: '40%' }}
      >
        {/* Sets the library to be used for date picker */}
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          {/* Let user pick the date */}
          <DatePicker
            label='Date'
            // Sets the value of the date picker to the date state
            value={date}
            // Run handleDateChange when the user changes the date
            onChange={handleDateChange}
            // Defines what component is rendered as the date picker field
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Collapse>
      {/* Stacks components horizontial */}
      <Stack direction='row' spacing={2}>
        {/* Textfield for duration */}
        <TextField
          // Sets id to duration
          id='duration'
          // Sets label to duration
          label='DURATION'
          // Sets the variant/style to filled
          variant='filled'
          // Sets width to 15%
          sx={{ width: '15%' }}
          // Runs handleDurationChange whenever the textfield value changed
          onChange={handleDurationChange}
          // Sets value of the date field to the duration state
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
          // Assigns filterOptions to a function that filter the client and project based on the input          filterOptions={CPFilter}
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
          empty={true}
          // Pass through all the tags
          tags={tagsData}
          // Assign handleDescriptionWithTagsData to be run to process the content in this component
          data={handleDescriptionWithTagsData}
          // Assign clear to null as field clearing is not required here
          clear={clearField}
          // Sets readOnly to false so user can edit the description
          readOnly={false}
        />
        {/* Log button */}
        <Button
          // Sets the button variant to text
          variant='contained'
          // Assign handleUpdateButton to be run on click of the button
          onClick={handleLogButton}
          // Adds a icon to the start of the button
          startIcon={<AddCircleIcon />}
        >
          LOG
        </Button>
      </Stack>
    </Paper>
  );
}

// Exports LogHeader
export default LogHeader;
