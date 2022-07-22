import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
// Import luxon component
import { DateTime, Interval } from 'luxon';

import { useNavigate } from 'react-router-dom';
// Import axios instance
import axiosInstance from '../Axios.js';
// Import redux components
import { useDispatch } from 'react-redux';
import { deleteLog } from '../Features/Logs';

import DescriptionWithTagsInput from './DescriptionWithTags';

import { useEffect, useMemo, useState } from 'react';

import { TransitionGroup } from 'react-transition-group';
import { Collapse } from '@mui/material';

function LogLister(props) {
  const editable = props.edit ?? true;

  // Create navigate function
  const navigate = useNavigate();
  // Creates dispatch function to update redux state
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [logs, setLogs] = useState([]);

  useMemo(() => {
    const logsContainer = [...props.logs];
    logsContainer.sort((a, b) => {
      const dateA = DateTime.fromFormat(a.date, 'yyyy-LL-dd');
      const dateB = DateTime.fromFormat(b.date, 'yyyy-LL-dd');
      const interval = Interval.fromDateTimes(dateA, dateB);
      if (isNaN(interval.length())) {
        return -1;
      } else {
        return interval.length();
      }
    });
    setLogs(logsContainer);
  }, [props.logs]);

  // Handles editing log button click
  function handleLogEdit(id) {
    // Dynamically pushes user to edit page of the specific log using it's ID
    navigate('/logs/edit/' + id);
  }

  function handleModalOpen(event, id) {
    event.preventDefault();
    setModalOpen(true);
    setLogToDelete(id);
  }

  function handleModalClose(event) {
    event.preventDefault();
    setModalOpen(false);
  }

  // Handles deleting log
  function handleLogDelete(event) {
    // Generates the url to which a request should be sent
    const url = '/CRUD/logs/' + logToDelete + '/';
    // Sends a delete request to delete the log
    axiosInstance.delete(url);
    // Removes the deleted tag from logData
    dispatch(deleteLog(logToDelete));
    handleModalClose(event);
  }

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Stack
        direction='column'
        spacing={0}
        sx={
          editable
            ? { width: '95%', margin: '2rem auto 0 auto' }
            : { width: '95%', margin: '0 auto' }
        }
      >
        {/* Grouper div to enclose the header */}
        <Stack
          direction='row'
          spacing={1}
          sx={{ display: 'flex', alignItems: 'center' }}
          key={0}
        >
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '15%' }}>
            DATE
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '15%' }}>
            DURATION
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '25%' }}>
            CLIENT/PROJECT
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '35%' }}>
            DESCRIPTION
          </Typography>
          {editable ? <span style={{ width: '10%' }}></span> : null}
        </Stack>
        <TransitionGroup>
          {logs.map((log) => (
            <Collapse key={log.id}>
              <Divider orientation='horizontal' flexItem />
              <Stack
                direction='row'
                spacing={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '40px',
                }}
                margin='0.2rem 0'
              >
                <Typography variant='body1' sx={{ width: '15%' }}>
                  {DateTime.fromFormat(log.date, 'yyyy-LL-dd').toFormat(
                    'dd/LL/yyyy'
                  )}
                </Typography>
                <Typography variant='body1' sx={{ width: '15%' }}>
                  {log.time}
                </Typography>
                <Typography variant='body1' sx={{ width: '25%' }}>
                  {log.client
                    ? props.CPData.find(
                        (client) =>
                          client.id === log.client && client.type === 'clients'
                      ).name
                    : props.CPData.find(
                        (project) =>
                          project.id === log.project &&
                          project.type === 'projects'
                      ).name}
                </Typography>
                {/* Custom field for description with tags */}
                <div style={{ width: '35%' }}>
                  <DescriptionWithTagsInput
                    // Set initial of this component not to be empty
                    empty={false}
                    // Pass through all the tags
                    tags={[]}
                    // Assign handleDescriptionWithTagsData to be run to process the content in this component
                    data={() => {
                      return null;
                    }}
                    // Assign clear to null as field clearing is not required here
                    clear={null}
                    // Provides the initial state to the component
                    intialField={log.descriptionRaw}
                    // Sets readOnly to false so user can edit the description
                    readOnly={true}
                  />
                </div>
                {editable ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'end',
                      width: '10%',
                    }}
                  >
                    <IconButton
                      aria-label='edit'
                      onClick={(event) => {
                        handleModalOpen(event, log.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      onClick={() => {
                        handleLogEdit(log.id);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                ) : null}
              </Stack>
            </Collapse>
          ))}
        </TransitionGroup>
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
            WOULD YOU LIKE TO DELETE THIS LOG
          </Typography>
          <Typography variant='body1' align='center' margin='0.5rem'>
            Deleting this log will mean that you will not be able to recover it
            again. This will PERMANENTLY delete the log.
          </Typography>
          <Stack
            direction='row'
            spacing={1}
            justifyContent='flex-end'
            marginTop='0.5rem'
          >
            <Button variant='text' onClick={handleModalClose}>
              CANCEL
            </Button>
            <Button
              variant='text'
              onClick={handleLogDelete}
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

export default LogLister;
