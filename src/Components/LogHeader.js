// Import MUI components
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarToday';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ArrowBackwardIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
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
import { Modal, Typography } from '@mui/material';

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
  const [tempDate, setTempDate] = useState(null);
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
  // Allow field clearing on value change
  const [clearField, setClearField] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

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
          date: date.toFormat('yyyy-LL-dd'),
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
          } else {
            console.log(error);
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

  function handleModalOpenClose(event) {
    event.preventDefault();
    setTempDate(date);
    setModalOpen(!modalOpen);
  }

  function handleDatePicked(newDate) {
    if (newDate !== date) {
      setTempDate(newDate);
    }
  }

  function handleDatePickedCancel() {
    setModalOpen(!modalOpen);
  }

  function handleDatePickedConfirm() {
    setDate(tempDate);
    setModalOpen(!modalOpen);
  }

  function handleBackDate(event) {
    event.preventDefault();
    setDate(date.plus({ days: -1 }));
  }

  function handleForwardDate(event) {
    event.preventDefault();
    setDate(date.plus({ days: 1 }));
  }

  // This is the JSX code rendered
  return (
    // Wrapper paper component
    <Paper
      sx={{
        margin: '1rem 1rem 0rem',
        padding: '1rem',
      }}
    >
      <Stack
        direction='column'
        width='100%'
        justifyContent='center'
        spacing={2}
      >
        <Typography variant='h6' align='center' width='100%'>
          LOG TIME
        </Typography>
        <Stack direction='row' justifyContent='center' spacing={2}>
          <IconButton aria-label='delete' onClick={handleBackDate}>
            <ArrowBackwardIcon />
          </IconButton>
          <Button
            variant='contained'
            onClick={handleModalOpenClose}
            endIcon={<CalendarMonthIcon />}
          >
            {date.toFormat('dd/MM/yyyy')}
          </Button>
          <IconButton aria-label='delete' onClick={handleForwardDate}>
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <div width='100%'>
          <Grid container spacing={2}>
            <Grid item xs={3} height='72px'>
              {/* Textfield for duration */}
              <TextField
                // Sets id to duration
                id='duration'
                // Sets label to duration
                label='DURATION'
                // Sets the variant/style to filled
                variant='outlined'
                // Runs handleDurationChange whenever the textfield value changed
                onChange={handleDurationChange}
                // Sets value of the date field to the duration state
                value={duration}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={3} height='72px'>
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
                // Assigns filterOptions to a function that filter the client and project based on the input          filterOptions={CPFilter}
                filterOptions={CPFilter}
                // Defines what is render as the input field
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='CLIENT OR PROJECT'
                    variant='outlined'
                  />
                )}
                // Assign handleAutocompleteSelectedChange to be run on change of client or project selected
                onChange={handleAutocompleteSelectedChange}
                // Sets the value of the client or project selected to the CPSelected state
                value={CPSelected}
                // Assign handleAutocompleteInputValueChange to be run on change of input entered by the user
                onInputChange={handleAutocompleteInputValueChange}
                // Sets the input value to the state inputValue
                inputValue={inputValue}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6} height='72px'>
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
            </Grid>
          </Grid>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
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
        </div>
      </Stack>
      <Modal open={modalOpen} onClose={handleModalOpenClose}>
        <Paper
          sx={{
            padding: '0.5rem',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant='h6' align='center' margin='0.5rem'>
            SELECT A DATE
          </Typography>
          {/* Sets the library to be used for date picker */}
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <StaticDatePicker
              displayStaticWrapperAs='desktop'
              openTo='day'
              value={tempDate}
              onChange={handleDatePicked}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Stack
            direction='row'
            spacing={1}
            justifyContent='flex-end'
            marginTop='0.5rem'
          >
            <Button variant='text' onClick={handleDatePickedCancel}>
              CANCEL
            </Button>
            <Button variant='text' onClick={handleDatePickedConfirm}>
              CONFIRM
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </Paper>
  );
}

// Exports LogHeader
export default LogHeader;
