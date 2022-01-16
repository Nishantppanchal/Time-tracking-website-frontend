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


import DescriptionWithTagsInput from './DescriptionWithTags';


import { useEffect, useState } from 'react';
import axiosInstance from '../Axios';


function LogHeader(props) {
    const { DateTime } = require("luxon");
    const filter = createFilterOptions();

    
    const [currentTab, setCurrentTab] = useState(2)
    const [date, setDate] = useState(DateTime.now())
    const [CPSelected, setCPSelected] = useState(null)
    const [duration, setDuration] = useState()
    const [description, setDescription] = useState()
    const [tagsSelected, setTagsSelected] = useState()
    const [userId, setUserId] = useState()


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


        function handleDateChange(newDate) {
            if (newDate != date) {
                setDate(newDate);
            };
        };

        function handleDurationChange(event) {
            setDuration(event.target.value);
        };
        
        async function handleDescriptionWithTagsData(data) {
            setDescription(JSON.stringify(data.raw));
            var tags = []
            for (let tag of data.tags) {
                console.log(tag.newValue)
                if (tag.newValue) {
                    axiosInstance.post('CRUD/tags/', {
                        name: tag.name.slice(9),
                        billable: tag.billable,
                        user: localStorage.getItem('user_id'),
                    }).then(() => {
                        axiosInstance.get('/getID/', { params:{
                            type: 'tag',
                            name: tag.name.slice(9),
                        }, }).then((response) => {
                            tags.push(response.data.id)
                        }).catch((error) => {
                            if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                                tags.push(error.response.data.requestData.data.id)
                            } 
                        });
                    }).catch((error) => {
                        if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                            axiosInstance.get('/getID/', { params:{
                                type: 'tag',
                                name: tag.name.slice(9),
                            }, }).then((response) => {
                                tags.push(response.data.id)
                            }).catch((error) => {
                                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                                    tags.push(error.response.data.requestData.data.id)
                                } 
                            });
                        }
                    });
                    // console.log({
                    //     name: tag.name.slice(9),
                    //     billable: tag.billable,
                    //     user: localStorage.getItem('user_id'),
                    // })
                } else {
                    tags.push(tag.id);
                };
                setTagsSelected(tags)
            };         
        };

        function handleLogButton(event) {
            console.log({
                time: duration,
                date: date.toFormat('yyyy-LL-dd'),
                description: description,
                tags: tagsSelected,
                client: CPSelected.id,
                user: localStorage.getItem('user_id'),
            });
            if (CPSelected.type == 'client') {
                axiosInstance.post('CRUD/logs/', {
                    time: duration,
                    date: date.toFormat('yyyy-LL-dd'),
                    description: description,
                    tags: tagsSelected,
                    client: CPSelected.id,
                    user: localStorage.getItem('user_id'),
                }).catch((error) => {
                    console.log(error.response)
                })
            } else {
                axiosInstance.post('CRUD/logs/', {
                    time: duration,
                    date: date.toFormat('yyyy-LL-dd'),
                    description: description,
                    tags: tagsSelected,
                    project: CPSelected.id,
                    user: localStorage.getItem('user_id'),
                })
            };
        };


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
                        options={props.CPData}
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
                                newValue: true,
                              });
                            }
                    
                            return filtered;
                        }}
                        renderInput={(params) => <TextField {...params} label="CLIENT OR PROJECT" variant="filled" />}
                        onChange={(event, newValue) => {
                            setCPSelected(newValue)
                        }}
                    />
                    <DescriptionWithTagsInput tags={props.tagsData} data={handleDescriptionWithTagsData}/>
                    <Button variant="text" onClick={handleLogButton}>Log It</Button>
                </Stack>
            </Paper>
        );
};

export default LogHeader;


