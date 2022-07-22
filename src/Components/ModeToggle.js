// Import React components
import {
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { toggleMode } from '../Features/Mode';

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
