import axiosInstance from './../Axios.js';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Home () {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        axiosInstance.get('timerNow/', {
            params: {time_now: Date.now()}
        }).then(
            (response) => {
                setIsLoading(false);
                console.log(response)
        }).catch((error) => {
            if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                setIsLoading(false);
            }
        });
    }, [setIsLoading])
    // axios.get('http://127.0.0.1:8000/api/timerCRUD/', {headers: {
    //     Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    //     'Content-Type': 'application/json',
    //     accept: 'application/json'
    // }} )
    if (isLoading) {
        return (<div>Loading</div>)
    } else {
        return (<div>Not loading</div>)
    }
    
};

export default Home;