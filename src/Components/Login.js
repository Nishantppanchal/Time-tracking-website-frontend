// Import CSS Components
import './../Styles/Global.css';
import './../Styles/Login.css';
// Import Material UI Components
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import VisibilityFilled from '@mui/icons-material/Visibility';
import { TextField, Typography } from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
// Import React Components
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';


function Login () {
    let navigate = useNavigate()
    
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [inputData, updateInputData] = useState({
        email: '',
        password: '',
    })

    function handleShowPassword() {
        setPasswordVisibility(!passwordVisibility)
    }

    function handleLoginChange(e) {
        updateInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Send request here
        navigate('/home')
    }

    return(
        <Box className='containerBox'>
            <Paper className='loginPaper'>
                
                <Typography variant='h5'>Login into your account </Typography>
                <Stack direction='row' spacing={0.5}>
                    <Typography className='loginCreateAccountCaption'>Don't have an account yet?</Typography>
                    <Typography component={Link} to='/signup' className='createOneLink'>Create one</Typography>
                </Stack>
                <Box fullWidth className='spacerLogin'/>
                <InputBase 
                    name='email'
                    id='email'
                    label='email'
                    className='EmailField' 
                    placeholder="jamesdoe@gmail.com" 
                    autoComplete='email'
                    onChange={handleLoginChange}
                    endAdornment={
                        <InputAdornment position="end"><EmailIcon color='visibilityOff' /></InputAdornment>
                    }/>
                <InputBase
                    name='password'
                    id='password'
                    label='test'
                    placeholder="password" 
                    className='PasswordField'
                    type={passwordVisibility ? 'text' : 'password'}
                    autoComplete='current-password'
                    onChange={handleLoginChange}
                    sx ={{ 

                     }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton 
                                aria-label='toggle password visibility'
                                onClick={handleShowPassword}
                                edge='end'>
                                    {passwordVisibility ? <VisibilityFilled color='visiblity' /> : <VisibilityOutlined color='visibilityOff'/>}
                                </IconButton>
                        </InputAdornment>
                    }/>
                <Box width='80%'>
                    <Button variant="contained" className='loginRoundButton' fullWidth onClick={handleSubmit}>Login</Button>
                </Box>
            </Paper>
        </Box>

    );
}

export default Login;