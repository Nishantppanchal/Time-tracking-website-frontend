import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';
// Import axios instance
import axiosInstance from '../Axios.js';
// Import redux components
import { useDispatch } from 'react-redux';


import { useState } from 'react';

import { deleteCP } from '../Features/CPData';

function CPLister(props) {
  // Create navigate function
  const navigate = useNavigate();
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [CPToDelete, setCPToDelete] = useState(null);

  // Handles editing log button click
  function handleCPEdit(event, id) {
    event.preventDefault();
    if (props.type === 'client') {
      navigate('/clients-and-projects/edit/clients/' + id);
    } else if (props.type === 'project') {
      navigate('/clients-and-projects/edit/projects/' + id);
    }
  }

  function handleModalOpen(event, id) {
    event.preventDefault();
    setModalOpen(true);
    setCPToDelete(id);
  }

  function handleModalClose(event) {
    event.preventDefault();
    setModalOpen(false);
  }

  // Handles deleting log
  function handleCPDelete(event) {
    var url = '';
    if (props.type === 'client') {
      url = 'CRUD/clients/' + CPToDelete + '/';
    } else if (props.type === 'project') {
      url = 'CRUD/projects/' + CPToDelete + '/';
    }
    // Sends a delete request to delete the log
    axiosInstance.delete(url);

    if (props.type === 'client') {
      dispatch(deleteCP({ id: CPToDelete, type: 'clients' }));
    } else if (props.type === 'project') {
      dispatch(deleteCP({ id: CPToDelete, type: 'projects' }));
    }

    handleModalClose(event);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

      }}
    >
      <Stack
        direction='column'
        spacing={0}
        divider={<Divider orientation='horizontal' flexItem />}
        sx={{ maxWidth: '600px', width: '80%' }}
      >
        {props.CPData.map((CP, index) => (
          <Stack
            direction='row'
            spacing={1}
            sx={{ display: 'flex', alignItems: 'center' }}
            key={index}
          >
            <Typography variant='body1' sx={{ width: '25%' }}>
              {CP.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                width: '75%',
              }}
            >
              <IconButton
                aria-label='edit'
                onClick={(event) => {
                  handleModalOpen(event, CP.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label='delete'
                onClick={(event) => {
                  handleCPEdit(event, CP.id);
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Paper
          sx={{
            padding: '0.5rem',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20rem',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant='h6' align='center' margin='0.5rem'>
            WOULD YOU LIKE TO DELETE THIS {props.type.toUpperCase()}
          </Typography>
          <Typography variant='body1' align='center' margin='0.5rem'>
            Deleting this {props.type} will mean that you will not be able to
            recover it again. This will PERMANENTLY delete the {props.type}.
          </Typography>
          <Stack
            direction='row'
            spacing={1}
            justifyContent='flex-end'
            marginTop='0.5rem'
          >
            <Button
              variant='text'
              onClick={handleModalClose}
            >
              CANCEL
            </Button>
            <Button
              variant='text'
              onClick={handleCPDelete}
              sx={{ color: '#FF6961' }}
            >
              CONFIRM
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
}

export default CPLister;
