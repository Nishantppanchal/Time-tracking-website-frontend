// Import React Components
import React from 'react';
import { render }from 'react-dom';
import {
  BrowserRouter,  Routes,
  Route
} from "react-router-dom";
// Import Apps 
import Entry from './Components/Entry';
import Login from './Components/Login';
import SignUp from './Components/Signup'
import Home from './Components/Home';
// Import Material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';


// Create custom theme
const theme = createTheme({
  palette: {
    type: 'light', //Dark or light theme
    primary: {
      main: '#3f51b5', // Primary color
    },
    secondary: {
      main: '#f50057', // Seconday color
    },
    divider: '#929292', // Divider color
    visiblity: {
      main: '#81c784',
    },
    visibilityOff: {
      main: '#b4b2b2',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
    ],
  },
});

// Components to render
render(
  <React.StrictMode> {/* Remove after development */}
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme} > {/* Assign custom theme */}
          <Routes> 
            <Route path='/' > {/* Root directory */}
              <Route index element={<Entry />} /> {/* Assigns a component to the root directory */}
              <Route path='login' element={<Login />} /> {/* Login page */}
              <Route path='signup' element={<SignUp />} /> {/* Sign Up page */}
              <Route path='home' element={<Home />} /> {/* Home page */}
            </Route>
          </Routes>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
