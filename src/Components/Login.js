// Import CSS Components
import './GlobalStyles.css';
// Import Material UI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/styles';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';


const CustomInputField = styled(InputBase)({
    border: '2px solid rgb(207, 207, 207)',
    borderRadius: '8%/50%',
    '& .Mui-focused': {
        border: '2px solid #3f51b5',
        borderRadius: '8%/50%',
    }
});

function Login () {
    return(
        <Box className='containerBox'>
            <Paper elevation={3} className='loginPaper'>
                {/* <TextField 
                    color='primary' 
                    id="Email" 
                    label="Email" 
                    variant="filled" 
                    autoComplete='email'
                    margin="normal" 
                    sx={{ m: '2%' }} 
                    className='loginTextField'
                    style={{ width: '80%'}}/> */}
                {/* <TextField 
                    color='primary' 
                    id="Password" 
                    label="Password" 
                    variant="filled" 
                    autoComplete='password'
                    type='current-password'
                    sx={{ m: '2%'}} 
                    style={{ width: '80%' }}/> */}
                <InputBase 
                    className='loginTextField' 
                    placeholder="jamesdoe@gmail.com" 
                    endAdornment={
                        <InputAdornment position="end"><EmailIcon /></InputAdornment>
                    }/>
                <Box sx={{ pt: '2%' }}>
                    <Button variant="contained" sx={{ "&:hover": {backgroundColor: "#333", } }}>Login</Button>
                </Box>
            </Paper>
        </Box>

    );
}

export default Login;