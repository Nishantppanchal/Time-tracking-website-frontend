import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 1000,
    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
    withCredentials: true,
})

export default axiosInstance;