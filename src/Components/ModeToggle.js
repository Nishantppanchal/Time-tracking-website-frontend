import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
// Import React components
import { useNavigate } from 'react-router-dom';
// Import axios instance
import AxiosInstance from '../Axios';
import {
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { getMode } from '../App';

import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { toggleMode } from '../Features/Mode';
import Brightness4 from '@mui/icons-material/Brightness4';
import { loginMethodStates } from '../Features/LoginMethod';
import { googleLogout } from '@react-oauth/google';

function ModeToggle(props) {
  const sx = props.sx ?? {};

  const dispatch = useDispatch();

  const mode = useSelector((state) => state.mode.value);

  function handleChangeMode(event, newMode) {
    event.preventDefault();
    if (newMode !== null) {
      dispatch(toggleMode());
    }
  }

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleChangeMode}
      size='small'
      sx={sx}
    >
      <ToggleButton value='light'>
        <LightModeIcon />
      </ToggleButton>
      <ToggleButton value='dark'>
        <DarkModeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ModeToggle;
