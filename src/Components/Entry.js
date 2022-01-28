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
  // Define function that allow directing users to other urls
  let navigate = useNavigate();

  // Handles event when login button pressed
  function handleLoginButton() {
    navigate("/login/");
  }
  // Handles event when sign up button pressed
  function handleSignUpButton() {
    navigate("/signup/");
  }

  // Code rendered on page
  return (
    <Box className='containerBox'>
      {/* Website title */}
      <Typography variant='h1' color='primary'>
        TRACKABLE
      </Typography>
      {/* Grid for the two buttons */}
      <Grid container direction='row' spacing={8} width='40%'>
        <Grid item xs={6}>
          {" "}
          {/* Let button fill half the grid */}
          {/* Login button */}
          <Button
            variant='contained'
            fullWidth
            onClick={handleLoginButton}
            className='roundButton'
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={6}>
          {" "}
          {/* Let button fill half the grid */}
          {/* Sign up button */}
          <Button
            variant='contained'
            fullWidth
            onClick={handleSignUpButton}
            className='roundButton'
          >
            SIGN UP
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
