import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Collapse from '@mui/material/Collapse'


import { useEffect, useState } from 'react';
import axiosInstance from '../Axios';


function LogHeader() {
    

    const [clientData, setClientData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [CPData, setCPData] = useState([]);
    const [currentTab, setCurrentTab] = useState(2)
    const [date, setDate] = useState()


    useEffect(() => {
        axiosInstance.get('CRUD/clients/').then(
            (response) => {
                console.log(response)
                setClientData([
                    ...response.data,
                ])
                
            }
        );

        axiosInstance.get('CRUD/projects/').then(
            (response) => {
                console.log(response)
                setProjectData([
                    ...response.data,
                ])
                
            }
        );

    }, [setCPData]);

    useEffect(() => {
        setCPData([
            ...projectData,
            ...clientData,
        ])
    }, [clientData, projectData])


    console.log(CPData)
    // useEffect(async () => {
    //     axiosInstance.get('timerCRUD/').then(
    //         (response) => {
    //             setCPData([
    //                 ...CPData,
    //                 response.data,
    //             ]);
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

        function handleTabChange(event, newTab) {
            setCurrentTab(newTab)
            if (newTab == 0) {
                setDate(moment().format())
            }
        };

        console.log(date)

        return (
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Item One" />
                        <Tab label="Item Two" />
                        <Tab label="Item Three" />
                        <Tab label='Custom Date' />
                    </Tabs>
                </Box>
                <Collapse orientation="vertical" in={(currentTab == 3 ? true : false)} sx={{ width: '40%' }} >
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Basic example"
                            value={date}
                            onChange={(newDate) => {
                            setDate(newDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Collapse>
                <Stack direction="row" spacing={2}>
                    <TextField id="time" label="TIME" variant="filled" />
                    <Autocomplete
                        id="CP"
                        options={CPData}
                        getOptionLabel={(option) => option.name}
                        groupBy={(option) => option.type}
                        sx={{ width: '30%' }}
                        renderInput={(params) => <TextField {...params} label="CLIENT OR PROJECT" variant="filled" />}
                    />
                    <Autocomplete
                        multiple
                        freeSolo
                        id="CP"
                        options={CPData}
                        getOptionLabel={(option) => option.name}
                        groupBy={(option) => option.type}
                        sx={{ width: '30%' }}
                        renderInput={(params) => <TextField {...params} label="CLIENT OR PROJECT" variant="filled" />}
                    />
                </Stack>
            </Paper>
        );
};

export default LogHeader;