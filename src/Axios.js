import axios from 'axios';
import { useState } from 'react';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 1000,
    headers: {
        Authorization: 'Bearer ' + ((localStorage.getItem('access_token')) ? localStorage.getItem('access_token'): sessionStorage.getItem('access_token')),
        'Content-Type': 'application/json',
        accept: 'application/json'
    },
})

axiosInstance.interceptors.request.use(
    function (response) {
        return response;
    }
)



axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (error.response.data.detail == "Invalid token header. No credentials provided.") {
            var refreshToken = null
            const originalRequest = error.config // Get original request to rerun

            if (localStorage.getItem('refresh_token')) {
                refreshToken =  localStorage.getItem('refresh_token');
            } else {
                refreshToken = sessionStorage.getItem('refresh_token')
            }
            
            if (refreshToken == null) {
                window.location.href = '/login/';
            }
            
            
            const test = await axios.post(
                'http://127.0.0.1:8000/api/auth/token/', {
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: 'fD0DNP9dnmdUiVbqldbPEKIfXGXPhj3RXVDEBAeK',
            }).then((response) => {
                if (localStorage.getItem('refresh_token')) {
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                } else {
                    sessionStorage.setItem('access_token', response.data.access_token);
                    sessionStorage.setItem('refresh_token', response.data.refresh_token);
                };

                axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access_token;
                originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token;
            }).then(async () => {
                const data = await axiosInstance(originalRequest)
                return data; // Gets original request to rerun
            }).catch(((error) => {
                if (error.response.detail == 'invalid_grant') {
                    if (localStorage.getItem('refresh_token')) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                    } else {
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('refresh_token');
                    };
                    window.location.href = '/login/';
                }
            }));

            error.response.data.requestData = test
            return Promise.reject(error);
        };
        return Promise.reject(error);
    }
)


export default axiosInstance;