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
import { useSelector, useDispatch } from 'react-redux';
import { updateLog } from '../Features/Logs';
// Import luxon component
import { DateTime } from 'luxon';
import { Typography } from '@mui/material';
import { updateCP } from '../Features/CPData';

function CPEditPage() {
  const { type, id } = useParams();
  // Creates a navigate function
  const navigate = useNavigate();
  // Creates a dispatch function to change the redux states
  const dispatch = useDispatch();

  const title = (type == 'clients' ? 'Client' : 'Project') + ' ID: ' + id;

  const [isCPDataLoading, setIsCPDataLoading] = useState(true);
  const [name, setName] = useState('');

  // Runs this code on every render/update after the DOM has updated
  useEffect(() => {
    const url = 'CRUD/' + type + '/' + id + '/';
    axiosInstance
      .get(url)
      .then((response) => {
        setName(response.data.name);
        setIsCPDataLoading(false);
      })
      .catch((error) => {
        // If the access token is invalid
        if (
          error.response.data.detail ===
          'Invalid token header. No credentials provided.'
        ) {
          setName(error.response.data.requestData.data.name);
          isCPDataLoading(false);
        }
      });
  }, []);

  function handleNameChange(event) {
    if (event.target.value !== name) {
      setName(event.target.value);
    }
  }

  function handleUpdateButton() {
    const url = '/CRUD/' + type + '/' + id + '/';

    axiosInstance
      .patch(url, { name: name })
      .then((response) => {
        dispatch(updateCP({ id: id, type: type, name: name }));
        navigate('/clients-and-projects');
      })
      .catch((error) => {
        if (
          error.response.data.detail ===
          'Invalid token header. No credentials provided.'
        ) {
          dispatch(updateCP({ id: id, type: type, name: name }));
          navigate('/clients-and-projects');
        }
      });
  }

  // Handles when the back button is clicked
  function handleBackButton(event) {
    // Prevents the default actions
    event.preventDefault();
    // Sends the url to the dashboard page
    navigate('/dashboard');
  }

  if (!isCPDataLoading) {
    return (
      <div>
        <Header />
        <Typography>{title}</Typography>
        <TextField
          id='name'
          label='name'
          variant='filled'
          onChange={handleNameChange}
          value={name}
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
      </div>
    );
  } else {
    return <Skeleton />;
  }
}

export default CPEditPage;
