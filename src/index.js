// Import React components
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import custom components
import Entry from "./Components/Entry";
import Login from "./Components/Login";
import SignUp from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import EditPage from "./Components/Edit";
// Import material UI components
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
// Import redux components
import { Provider } from 'react-redux';
import store from './Store';

// Create custom theme
const theme = createTheme({
  palette: {
    //Dark or light theme
    mode: "light", 
    // Primary color
    primary: {
      main: "#3f51b5", 
    },
    // Seconday color
    secondary: {
      main: "#f50057", 
    },
    // Divider color
    divider: "#929292", 
    // Password visible on colour
    visiblity: {
      main: "#81c784",
    },
    // Password visible off colour
    visibilityOff: {
      main: "#b4b2b2",
    },
  },
  typography: {
    fontFamily: ["Roboto"],
  },
});

// Components to render
render(
  <React.StrictMode> {/* Remove after development */}
    <BrowserRouter>
      {/* Loads custom CSS */}
      <StyledEngineProvider injectFirst>
        {/* Assign custom theme */}
        <ThemeProvider theme={theme}> 
          {/* Provides redux global state to all components */}
          <Provider store={store}>
            <Routes>
              {/* Root directory */}
              <Route path='/'>
                {/* Assigns a component to the root directory */}
                <Route index element={<Entry />} /> 
                {/* Login page */}
                <Route path='login' element={<Login />} />
                {/* Sign Up page */}
                <Route path='signup' element={<SignUp />} />
                {/* Home page */} 
                <Route path='dashboard' element={<Dashboard />} /> 
                {/* Edit page */}
                <Route path='edit/:id' element={<EditPage />} />
              </Route>
            </Routes>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
