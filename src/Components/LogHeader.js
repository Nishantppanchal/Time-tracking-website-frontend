import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import AdapterMoment from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';


import { useEffect, useState } from 'react';
import axiosInstance from '../Axios';


function LogHeader() {
    const { DateTime } = require("luxon");
    const filter = createFilterOptions();

    const [CPData, setCPData] = useState([]);
    const [currentTab, setCurrentTab] = useState(2)
    const [date, setDate] = useState(DateTime.now())
    const [duration, setDuration] = useState()


    useEffect(() => {
        axiosInstance.get('clientProjectGet/').then(
            (response) => {
                console.log(response)
                setCPData([
                    ...response.data,
                ])
                
            }
        );
    }, [setCPData]);


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
                setDate(DateTime.now().plus({ days: -2 }));
            } else if (newTab == 1) {
                setDate(DateTime.now().plus({ days: -1 }));
            } else if (newTab == 2) {
                setDate(DateTime.now().plus({ days: -2 }));
            };
        };

        function handleLogButton(event) {
            return null
        };

        function handleDateChange(newDate) {
            if (newDate != date) {
                setDate(newDate);
            };
        };

        function handleDurationChange(event) {
            setDuration(event.target.value);
        };

        console.log(date)

        return (
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label={DateTime.now().plus({ days: -2 }).monthShort + ' ' + DateTime.now().plus({ days: -2 }).day} />
                        <Tab label={DateTime.now().plus({ days: -1 }).monthShort + ' ' + DateTime.now().plus({ days: -1 }).day} />
                        <Tab label='Today' />
                        <Tab label='Custom Date' />
                    </Tabs>
                </Box>
                <Collapse orientation="vertical" in={(currentTab == 3 ? true : false)} sx={{ width: '40%' }} >
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Basic example"
                            value={date}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Collapse>
                <Stack direction="row" spacing={2}>
                    <TextField id="duration" label="DURATION" variant="filled" sx={{ width: '15%' }} onChange={handleDurationChange} />
                    <Autocomplete
                        id="CP"
                        options={CPData}
                        getOptionLabel={(option) => option.name}
                        groupBy={(option) => option.type}
                        sx={{ width: '30%' }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                    
                            const { inputValue } = params;
                            const isExisting = options.some((option) => inputValue === option.title);
                            if (inputValue !== '' && !isExisting) {
                              filtered.push({
                                inputValue,
                                name: `Add "${inputValue}"`,
                              });
                            }
                    
                            return filtered;
                        }}
                        renderInput={(params) => <TextField {...params} label="CLIENT OR PROJECT" variant="filled" />}
                    />
                    <Stack direction="column" spacing={2} sx={{ width: '40%' }}>
                        <TextField multiline id='description' label='DESCRIPTION' variant='filled' minRows={4} />
                        <Autocomplete
                            multiple
                            id="tags-filled"
                            options={CPData.map((option) => option.name)}
                            getOptionLabel={(option) => option.name}
                            freeSolo
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                        
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option.title);
                                if (inputValue !== '' && !isExisting) {
                                  filtered.push({
                                    inputValue,
                                    name: `Add "${inputValue}"`,
                                  });
                                }
                        
                                return filtered;
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="freeSolo"
                                    placeholder="Favorites"
                                />
                            )}
                        />
                    </Stack>
                    <Button variant="text" onClick={handleLogButton}>Log It</Button>
                </Stack>
            </Paper>
        );
};

export default LogHeader;


