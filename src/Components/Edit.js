import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Axios";
import { useNavigate } from "react-router-dom";


import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import DescriptionWithTagsInput from './DescriptionWithTags';
import { Collapse } from "@mui/material";


function EditPage() {
    const { id } = useParams();
    const { DateTime } = require("luxon");

    const filter = createFilterOptions();
    const navigate = useNavigate();

    const [logData, setLogData] = useState(null)
    const [isLogLoading, setIsLogLoading] = useState(true)
    const [isCPDataLoading, setIsCPDataLoading] = useState(true)
    const [isTagsDataLoading, setIsTagsDataLoading] = useState(true)
    const [CPData, setCPData] = useState([])
    const [tagsData, setTagsData] = useState([])
    const [description, setDescription] = useState()
    const [descriptionRaw, setDescriptionRaw] = useState()
    const [tagsSelected, setTagsSelected] = useState([])
    const [duration, setDuration] = useState()
    const [CPSelected, setCPSelected] = useState(null)
    const [inputValue, setInputValue] = useState()
    const [date, setDate] = useState()
    const [noFieldsChangedError, setNoFieldsChangedError] = useState(false)

    useEffect(() => {
        const url = 'CRUD/logs/' + id + '/'
        axiosInstance.get(url).then(
            (response) => {
                console.log(response.data)
                setLogData(response.data)
                setIsLogLoading(false)
                setDuration(response.data.time)
                setDate(DateTime.fromFormat(response.data.date, 'yyyy-LL-dd'))
            }
        ).catch(
            (error) => {
                console.log(error)
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    setLogData(error.response.data.requestData.data)
                    setIsLogLoading(false)
                    setDuration(error.response.data.requestData.data.time)
                    setDate(DateTime.fromFormat(error.response.data.requestData.data.date, 'yyyy-LL-dd'))
                }
            }
        )
    }, [setLogData])

    useEffect(() => {
        axiosInstance.get('clientProjectGet/').then(
            (response) => {
                console.log(response)
                setCPData([
                    ...response.data
                ])
                setIsCPDataLoading(false)
            }
        ).catch(
            (error) => {
                console.log(error)
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    setCPData([
                        ...error.response.data.requestData.data,
                    ])
                    setIsCPDataLoading(false)
                }
            }
        )
    }, [setCPData])

    useEffect(() => {
        axiosInstance.get('CRUD/tags/').then(
            (response) => {
                console.log(response)
                setTagsData([
                    ...response.data,
                ])
                setIsTagsDataLoading(false)
            }
        ).catch(
            (error) => {
                console.log(error)
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    setTagsData([
                        ...error.response.data.requestData.data,
                    ])
                    setIsTagsDataLoading(false)
                }
            }
        )
    }, [setTagsData])

    useEffect(() => {
        if (CPData.length > 0 && logData != null && CPSelected == null) {
            if (logData.client) {
                const client = CPData.filter((data) => data.id == logData.client && data.type == 'clients')[0]
                setCPSelected(client)
            } else {
                const project = CPData.filter((data) => data.id == logData.project && data.type == 'projects')[0]
                setCPSelected(project)
            }
        }
        
    }, [CPData, logData])

    async function handleDescriptionWithTagsData(data) {
        console.log(data)
        setDescription(data.raw.blocks.map((line) => {return line.text}).join(' '))
        setDescriptionRaw(JSON.stringify(data.raw))
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
                };
            } else {
                tags.push(tag.id)
            };
        };
        console.log(tags)
        await setTagsSelected(tags)

        console.log(newTags)
        if (newTags.length != 0) {
            await setTagsData([
                ...newTags,
                ...tagsData,
            ])
        }
    }

    function handleDurationChange(event) {
        setDuration(event.target.value)
    }

    function handleDateChange(newDate) {
        if (newDate != date) {
            setDate(newDate)
        }
    }
    
    function handleUpdateButton(event) {
        event.preventDefault()

        if (CPSelected.newValue == true) {
            if (CPSelected.type == 'client') {
                axiosInstance.post('CRUD/clients/', {
                    name: CPSelected.name.slice(12),
                    user: localStorage.getItem('user_id'),
                    colour: 'red',
                }).then(async (response) => {
                    await setCPSelected(response.data);
                    setCPData([
                        response.data,
                        ...CPData,
                    ]);
                }).catch(async (error) => {
                    if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                        await setCPSelected(error.response.data.requestData.data);
                        setCPData([
                            error.response.data.requestData.data,
                            ...CPData,
                        ]);
                    }
                });
            } else  {
                axiosInstance.post('CRUD/projects/', {
                    name: CPSelected.name.slice(13),
                    user: localStorage.getItem('user_id'),
                    colour: 'red',
                }).then(async (response) => {
                    await setCPSelected(response.data);
                    setCPData([
                        response.data,
                        ...CPData,
                    ]);
                }).catch(async (error) => {
                    if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                        await setCPSelected(error.response.data.requestData.data);
                        setCPData([
                            error.response.data.requestData.data,
                            ...CPData,
                        ]);
                    }
                });
            }
        }

        const url = 'CRUD/logs/' + id + '/'

        var updatedData = {};
        if (duration != logData.time) {
            updatedData.time = duration
        }
        if (date.toFormat('yyyy-LL-dd') != logData.date) {
            updatedData.date = date.toFormat('yyyy-LL-dd')
        }
        if (descriptionRaw != logData.descriptionRaw) {
            updatedData.description = description;
            updatedData.descriptionRaw = descriptionRaw;
            updatedData.tags = tagsSelected;
        }

        if (CPSelected.type == 'clients' && CPSelected.id != logData.client) {
            updatedData.client = CPSelected.id;
        } else if (CPSelected.type == 'projects' && CPSelected.id != logData.project) {
            updatedData.project = CPSelected.id;
        }

        if (Object.keys(updatedData).length > 0) {
            axiosInstance.patch(url, updatedData).then(
                (response) => {navigate('/home')}
            )
        } else {
            setNoFieldsChangedError(true)
        }
    }

    if (!isLogLoading && !isCPDataLoading && !isTagsDataLoading) {
        return (
            <div>
                <h1>Tag ID: {id}</h1>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DatePicker
                        label="Basic example"
                        value={date}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <TextField id="duration" label="DURATION" variant="filled" sx={{ width: '15%' }} onChange={handleDurationChange} value={duration}/>
                <Autocomplete 
                    id='CP'
                    options={CPData}
                    getOptionLabel={(option) => option.name}
                    groupBy={(option) => option.type}
                    sx={{ width: '30%' }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        if (inputValue !== '') {
                            filtered.push({
                                inputValue,
                                name: `ADD ClIENT: ${inputValue}`,
                                name: true,
                                type: 'client'
                            });
                            filtered.push({
                                inputValue,
                                name: `ADD PROJECT: ${inputValue}`,
                                newValue: true,
                                type: 'project'
                            })
                        }

                        return filtered;
                    }}
                    renderInput={(params) => <TextField {...params} label='CLIENT OR PROJECT' variant='filled' />}
                    onChange={(event, newValue) => {
                        setCPSelected(newValue)
                    }}
                    value={CPSelected}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    inputValue={inputValue}
                />
                <DescriptionWithTagsInput empty={false} tags={tagsData} data={handleDescriptionWithTagsData} clear={null} intialField={logData.descriptionRaw} />
                <Button variant='text' onClick={handleUpdateButton}>UPDATE</Button>
                <Collapse orientation="vertical" in={noFieldsChangedError} sx={{ width: '40%' }}>
                    <Alert severity="error">No fields changed</Alert>
                </Collapse>
            </div>
        )
    } else {
        return (
            <Skeleton />
        )
    }
}

export default EditPage;