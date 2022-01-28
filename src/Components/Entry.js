// Import CSS styles
import "./../Styles/Global.css";
// Import React components
import { useNavigate } from "react-router-dom";
// Import Material UI components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

function Home() {
  // Define navigate function
  let navigate = useNavigate();

  // Handles event when login button pressed
  function handleLoginButton() {
    // Sends user to login page
    navigate("/login/");
  }
  // Handles event when sign up button pressed
  function handleSignUpButton() {
    // Sends user to sign up page
    navigate("/signup/");
  }

  // Thsi is the JSX rendered on page
  return (
    // Container Box
    <Box className='containerBox'>
      {/* Website title */}
      <Typography variant='h1' color='primary'>
        TRACKABLE
      </Typography>
      {/* Grid for the two buttons */}
      <Grid container direction='row' spacing={8} width='40%'>
        {/* Let button fill half the grid */}
        <Grid item xs={6}>
          {/* Login button */}
          <Button
            // Sets the varient of button to contained
            variant='contained'
            // Make the width 100%
            fullWidth
            // Assign handleLoginButton to run on click of this button
            onClick={handleLoginButton}
            // Custom CSS
            className='roundButton'
          >
            Login
          </Button>
        </Grid>
        {/* Let button fill half the grid */}
        <Grid item xs={6}>
          {/* Sign up button */}
          <Button
            // Sets the varient of button to contained
            variant='contained'
            // Make the width 100%
            fullWidth
            // Assign handleSignUpButton to run on click of this button
            onClick={handleSignUpButton}
            // Custom CSS
            className='roundButton'
          >
            SIGN UP
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// Exports Home
export default Home;
