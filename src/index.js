// Import React Components
import React from 'react';
import { render }from 'react-dom';
import {
  BrowserRouter,  Routes,
  Route
} from "react-router-dom";
// Import Apps 
import Home from './Components/Home';
import Login from './Components/Login';
import SignUp from './Components/Signup'
// Import Material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create custom theme
const theme = createTheme({
  palette: {
    type: 'light', //Dark or light them
    primary: {
      main: '#3f51b5', // Primary color
    },
    secondary: {
      main: '#f50057', // Seconday color
    },
    divider: '#929292', // Divider color
  },
});

// Components to render
render(
  <React.StrictMode> {/* Remove after development */}
    <BrowserRouter>
      <ThemeProvider theme={theme} > {/* Assign custom theme */}
        <Routes> 
          <Route path='/' > {/* Root directory */}
            <Route index element={<Home />} /> {/* Assigns a component to the root directory */}
            <Route path='login' element={<Login />} /> {/* Login page */}
            <Route path='login' element={<SignUp />} /> {/* Sign Up page */}
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
