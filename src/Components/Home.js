// Import CSS Components
import './GlobalStyles.css';
// Import React Components
import { useNavigate } from 'react-router-dom';
// Import Material UI Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


function Home () {
    // Define function that allow directing users to other urls
    let navigate = useNavigate();

    // Handles event when login button pressed
    function handleLoginButton() {
        navigate('/login/')
    }
    // Handles event when sign up button pressed
    function handleSignUpButton() {
        navigate('/signup/')
    }

    // Code rendered on page
    return(
        <Box className='containerBox'>

            <Typography color='primary.main' className='title'>
                TRACKABLE
            </Typography>

            
        </Box>
    );
}

export default Home;