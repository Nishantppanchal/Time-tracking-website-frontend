// Import CSS Components
import './../Styles/Global.css';
import './../Styles/Signup.css';
// Import Material UI Components
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import { useState } from 'react';
import VisibilityFilled from '@mui/icons-material/Visibility';
import { Typography } from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert'
// Import React Components
import { Link, useNavigate } from "react-router-dom";
// Import Custom Components
import passwordValidator from './PasswordValidator'
// Import Axios
import axios from 'axios';


function SignUp () {
    let navigate = useNavigate()
    
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [inputData, updateInputData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        retypedPassword: '',
    })
    const [retypePasswordStatus, setRetypePasswordStatus] = useState(false)
    const [passwordValidationStatus, setPasswordValidationStatus] = useState({
        hasError: false,
        errors: [],
    })
    const [formValidationStatus, setFormValidationStatus] = useState({
        firstName: {hasError: false, errors: null},
        lastName: {hasError: false, errors: null},
        email: {hasError: false, errors: null},
    })

    function handleShowPassword() {
        setPasswordVisibility(!passwordVisibility)
    }

    function handleRegisterChange(e) {
        updateInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        });
        if (e.target.name == 'password') {
            if (e.target.value!= '') {
                setRetypePasswordStatus(true);
            } else {
                setRetypePasswordStatus(false);
            };
        };
        if (e.target.name == 'password' || e.target.name == 'retypedPassword') {
            let inputs = (e.target.name == 'password' ? 
                {password: e.target.value, retypedPassword: inputData.retypedPassword} :
                {password: inputData.password, retypedPassword: e.target.value})
            console.log(inputs)
            const errors = passwordValidator(inputs)
            if (errors.length != 0) {
                console.log('cool')
                setPasswordValidationStatus({
                    hasError: true,
                    errors: errors,
                })
            } else {
                console.log('test')
                setPasswordValidationStatus({
                    hasError: false,
                    errors: [],
                })
            }
        } else if (e.target.value != '') {
            setFormValidationStatus({
                ...formValidationStatus,
                [e.target.name]: { hasError: false, errors:null }
            }).then(console.log(formValidationStatus));
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        var error = false
        var data = formValidationStatus
        if (passwordValidator({password: inputData.password, retypedPassword: inputData.retypedPassword}).lenght == 0) {error = true;} 
        if (inputData.password == '') {
            setPasswordValidationStatus({
                hasError: true,
                errors: [... new Set(['password field is empty', ...passwordValidationStatus.errors])],
            });
            error = true;
        }  
        if (inputData.firstName == '') {
            data = {
                ...data,
                firstName: { hasError: true, errors: 'field is empty' },
            }
            error = true;
        } 
        if (inputData.lastName == '') {
            data = {
                ...data,
                lastName: { hasError: true, errors: 'field is empty' },
            };
            error = true;
        }
        if (inputData.email == '') {
            data = {
                ...data,
                email: { hasError: true, errors: 'field is empty' },
            };
            error = true;
        }
        setFormValidationStatus(data);

        if (error == false) {
            axios.post('http://127.0.0.1:8000/api/user/register/', {
                first_name: inputData.firstName,
                last_name: inputData.lastName,
                email: inputData.email,
                password: inputData.password,
            }).then((response) => {
                if (response.status === 201) {
                    navigate('/home')
                }
            }).catch((error) => {
                if (error.response.status === 400) {
                    setFormValidationStatus({
                        ...formValidationStatus,
                        email: { hasError: true, errors: 'This email is already in use' },
                    });
                };
            });

        };
    }

    return(
        <Box className='containerBox'>
            {/* {passwordValidationStatus.errors.map((error) => {
                return(
                    <Alert severity="error">{error}</Alert>
                )    
            })} */}

            <Paper className='registerPaper'>
                <Typography variant='h5'>Sign up to Trackable</Typography>
                <Box className='spacerRegister' />
                <Grid container spacing={0} className='nameGrid'>
                    <Grid item xs={5.7}>
                        {console.log(formValidationStatus.firstName.hasError)}
                        <InputBase 
                            error={formValidationStatus.firstName.hasError}
                            name='firstName'
                            id='firstName'
                            label='firstname'
                            className='nameField' 
                            placeholder="first name" 
                            autoComplete='given-name'
                            onChange={handleRegisterChange}/>
                    </Grid>
                    <Grid item xs/>
                    <Grid item xs={5.7}>
                        <InputBase 
                            error={formValidationStatus.lastName.hasError}
                            name='lastName'
                            id='lastName'
                            label='lastName'
                            className='nameField' 
                            placeholder="last name" 
                            autoComplete='family-name'
                            onChange={handleRegisterChange}/>
                    </Grid>
                </Grid>
                <InputBase 
                    error={formValidationStatus.email.hasError}
                    name='email'
                    id='email'
                    label='email'
                    className='EmailField' 
                    placeholder="jamesdoe@gmail.com" 
                    autoComplete='email'
                    onChange={handleRegisterChange}
                    endAdornment={
                        <InputAdornment position="end"><EmailIcon color='visibilityOff' /></InputAdornment>
                    }/>
                <InputBase 
                    name='password'
                    id='password'
                    className='PasswordField' 
                    placeholder="password" 
                    type={passwordVisibility ? 'text' : 'password'}
                    autoComplete='new-password'
                    onChange={handleRegisterChange}
                    error={passwordValidationStatus.hasError}
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

                <Collapse in={retypePasswordStatus} className='createPasswordCollapse'>
                    <Box className='collapseBoxAlign' fullWidth>
                        <InputBase 
                            name='retypedPassword'
                            id='retypedPassword'
                            className='PasswordField' 
                            placeholder="retype password" 
                            type={passwordVisibility ? 'text' : 'password'}
                            autoComplete='new-password'
                            onChange={handleRegisterChange}
                            error={passwordValidationStatus.hasError}
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
                    </Box>
                </Collapse>
                
                <Collapse in={passwordValidationStatus.hasError} className='createPasswordCollapse'>
                    <Box className='collapseBoxAlign'>
                        {passwordValidationStatus.errors.map((error) => {
                            return(
                                <Alert severity='error' className='passwordAlert'>{error}</Alert>
                            )
                        })}
                    </Box>
                </Collapse>

                <Box width='80%'>
                    <Button variant="contained" className='registerRoundButton' fullWidth onClick={handleSubmit}>SIGN UP</Button>
                </Box>
            </Paper>
        </Box>

    );
}

export default SignUp;