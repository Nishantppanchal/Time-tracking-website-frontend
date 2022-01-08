import axiosInstance from './../Axios.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import './../Styles/Home.css';
import LogHeader from './LogHeader';

function Home () {

    const [isLoading, setIsLoading] = useState({
        loading: true,
        timer: null,
    })


    // useEffect(async () => {
    //     axiosInstance.get('timerCRUD/', {
    //     }).then(
    //         (response) => {
    //             if (response.data.length == 1) {
    //                 setIsLoading({
    //                     loading: false,
    //                     timer: response.data[0],
    //                 });
    //             } else {
    //                 setIsLoading({
    //                     loading: false,
    //                     timer: null,
    //                 });
    //             };
    //     }).catch((error) => {
    //         if (error.response.data.detail == "Invalid token header. No credentials provided.") {
    //             console.log(error)
    //             if (error.response.data.requestData.data.length == 1) {
    //                 setIsLoading({
    //                     loading: false,
    //                     timer: error.response.data.requestData.data[0],
    //                 });
    //             } else {
    //                 setIsLoading({
    //                     loading: false,
    //                     timer: null,
    //                 });
    //             };
    //         }
    //     });
    // }, [setIsLoading])
    // axios.get('http://127.0.0.1:8000/api/timerCRUD/', {headers: {
    //     Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    //     'Content-Type': 'application/json',
    //     accept: 'application/json'
    // }} )

    

    // if (isLoading.loading) {
    //     return (<Skeleton />)
    // } else {
    //     return (
    //         <Paper sx={{ width: '100%' }}>

    //         </Paper>
    //     )
    // }
    
    return (
        <LogHeader />
    );
    
};

export default Home;