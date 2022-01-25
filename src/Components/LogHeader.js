import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';


import DescriptionWithTagsInput from './DescriptionWithTags';


import { useEffect, useState } from 'react';
import axiosInstance from '../Axios';
import { gridColumnsTotalWidthSelector } from '@mui/x-data-grid';


function LogHeader(props) {
    const { DateTime } = require("luxon");

    const filter = createFilterOptions();
    
    const [currentTab, setCurrentTab] = useState(2)
    const [date, setDate] = useState(DateTime.now())
    const [CPSelected, setCPSelected] = useState(null)
    const [duration, setDuration] = useState('')
    const [descriptionRaw, setDescriptionRaw] = useState()
    const [description, setDescription] = useState()
    const [tagsSelected, setTagsSelected] = useState([])
    const [newTags, setNewTags] = useState([])
    const [tagsData, setTagsData] = useState(props.tagsData);
    const [clearField, setClearField] = useState(true)
    const [inputValue, setInputValue] = useState('')

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
        setDescription(data.raw.blocks.map((line) => {return line.text}).join(' '))
        setDescriptionRaw(JSON.stringify(data.raw));
        var newTags = []
        var tags = []
        for (let tag of data.tags) {
            if (tag.newValue) {
                var doesTagExist = await axiosInstance.get('doesTagExist/', {
                    params: {name: tag.name.slice(9),},
                }).then((response) => {
                    return response.data
                }).catch((error) => {
                    if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                        return error.response.data.requestData.data
                    }
                });
                if (!doesTagExist.exists) {
                    var data = await axiosInstance.post('CRUD/tags/', {
                        name: tag.name.slice(9),
                        billable: tag.billable,
                        user: localStorage.getItem('user_id'),
                    }).then((response) => {
                        return response.data
                    }).catch((error) => {
                        if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                            return error.response.data.requestData.data
                        }
                    });
                    tags.push(data.id)
                    newTags.push(data)
                    console.log(newTags)
                } else {
                    tags.push(data.id)
                }
            } else {
                tags.push(tag.id);
            };
        };   
        await setTagsSelected(tags)
        
        console.log(newTags)
        if (newTags.length != 0) {
            await props.addTag(newTags)
        }
    };

    function handleLogButton(event) {
        event.preventDefault()

        if (CPSelected.newValue == true) {
            if (CPSelected.type == 'client') {
                axiosInstance.post('CRUD/clients/', {
                    name: CPSelected.name.slice(12),
                    user: localStorage.getItem('user_id'),
                    colour: 'red',
                }).then(async (response) => {
                    await setCPSelected(response.data);
                    props.addCP(response.data);
                }).catch(async (error) => {
                    if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                        await setCPSelected(error.response.data.requestData.data);
                        props.addCP(error.response.data.requestData.data)
                    }
                });
            } else  {
                axiosInstance.post('CRUD/projects/', {
                    name: CPSelected.name.slice(13),
                    user: localStorage.getItem('user_id'),
                    colour: 'red',
                }).then(async (response) => {
                    await setCPSelected(response.data);
                    props.addCP(response.data);
                }).catch(async (error) => {
                    if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                        await setCPSelected(error.response.data.requestData.data);
                        props.addCP(error.response.data.requestData.data)
                    }
                });
            }
        }

        if (CPSelected.type == 'clients') {
            console.log('done')
            axiosInstance.post('CRUD/logs/', {
                time: duration,
                date: date.toFormat('yyyy-LL-dd'),
                description: description,
                descriptionRaw: descriptionRaw,
                tags: tagsSelected,
                client: CPSelected.id,
                user: localStorage.getItem('user_id'),
            }).then((response) => {
                console.log(response.data)
                props.addLog(response.data)
            }).catch((error) => {
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    props.addLog(error.response.data.requestData.data)
                }
            })
        } else {
            axiosInstance.post('CRUD/logs/', {
                time: duration,
                date: date.toFormat('yyyy-LL-dd'),
                description: description,
                descriptionRaw: descriptionRaw,
                tags: tagsSelected,
                project: CPSelected.id,
                user: localStorage.getItem('user_id'),
            }).then((response) => {
                console.log(response.data)
                props.addLog(response.data)
            }).catch((error) => {
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    props.addLog(error.response.data.requestData.data)
                }
            })
        };

        setDuration('')
        setCPSelected(null)
        setInputValue('')
        setClearField(!clearField)
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
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DatePicker
                        label="Basic example"
                        value={date}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Collapse>
            <Stack direction="row" spacing={2}>
                <TextField id="duration" label="DURATION" variant="filled" sx={{ width: '15%' }} onChange={handleDurationChange} value={duration}/>
                <Autocomplete
                    id="CP"
                    options={props.CPData}
                    getOptionLabel={(option) => option.name}
                    groupBy={(option) => option.type}
                    sx={{ width: '30%' }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                
                        const { inputValue } = params;
                        if (inputValue !== '') {
                            filtered.push({
                                inputValue,
                                name: `ADD CLIENT: ${inputValue}`,
                                newValue: true,
                                type: 'client'
                            });
                            filtered.push({
                                inputValue,
                                name: `ADD PROJECT: ${inputValue}`,
                                newValue: true,
                                type: 'project'
                            });
                        }
                
                        return filtered;
                    }}
                    renderInput={(params) => <TextField {...params} label="CLIENT OR PROJECT" variant="filled" />}
                    onChange={(event, newValue) => {
                        setCPSelected(newValue)
                    }}
                    value={CPSelected}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    inputValue={inputValue}
                />
                <DescriptionWithTagsInput empty={true} tags={props.tagsData} data={handleDescriptionWithTagsData} clear={clearField} />
                <Button variant="text" onClick={handleLogButton}>LOG</Button>
            </Stack>
        </Paper>
    );
};

export default LogHeader;


