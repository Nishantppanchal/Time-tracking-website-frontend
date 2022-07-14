import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
// Import luxon component
import { DateTime } from 'luxon';

import { useNavigate } from 'react-router-dom';
// Import axios instance
import axiosInstance from '../Axios.js';
// Import redux components
import { useDispatch } from 'react-redux';
import { deleteLog } from '../Features/Logs';

import { useState } from 'react';

import { deleteCP } from '../Features/CPData';
import { CssBaseline } from '@mui/material';

function CPListerLoading() {

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0rem 5rem'
      }}
    >
      <Stack
        direction='column'
        spacing={2}
        sx={{ width: '95%' }}
      >
        {Array.from(Array(5), (e, i) => {
            return (
                <Skeleton variant='rectangular' key={i} />
            )
        })}
      </Stack>
    </Box>
  );
}

export default CPListerLoading;