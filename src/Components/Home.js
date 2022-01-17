import axiosInstance from './../Axios.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import './../Styles/Home.css';
import LogHeader from './LogHeader';
import { Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem  } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function Home () {
    const [CPData, setCPData] = useState([]);
    const [tagsData, setTagsData] = useState([]);
    const [logData, setLogData] = useState([])

    const [isCPDataLoading, setIsCPDataLoading] = useState(true)
    const [isTagsDataLoading, setIsTagsDataLoading] = useState(true)
    const [isLogDataLoading, setIsLogDataLoading] = useState(true)

    const columns = [
        { 
            field: 'client/project', 
            headerName: 'client/project', 
            width: 90,  
            valueGetter: (params) => 
                (params.row.client ? 
                    CPData.filter((data) => data.id == params.row.client && data.type == 'clients')[0].name : 
                    CPData.filter((data) => data.id == params.row.project && data.type == 'projects')[0].name
                ),
        },
        {field: 'time', headerName: 'duration', width: 90, type: 'number'},
        {field: 'description', headerName: 'description', width: 180},
        {
            field: 'tags',
            headerName: 'tags',
            width: 90,
            valueGetter: (params) => {
                var tags = []
                for (const tag of params.row.tags) {
                    tags.push(tagsData.filter((data) => data.id == tag)[0].name.toString());
                };
                return tags.join(', ')
            }
        },
        {
            field: 'edit',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem icon={<DeleteIcon />} label='Delete' />,
                <GridActionsCellItem icon={<EditIcon />} label='Edit' />,
            ]
        },
    ]

    useEffect(() => {
        axiosInstance.get('CRUD/logs/').then(
            (response) => {
                console.log(response.data)
                setLogData(response.data);
                setIsLogDataLoading(false);
            }
        )
    }, [setLogData])    

    useEffect(() => {
        axiosInstance.get('clientProjectGet/').then(
            (response) => {
                console.log(response)
                setCPData([
                    ...response.data,
                ])
                setIsCPDataLoading(false)
            }
        ).catch(
            (error) => {
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    axiosInstance.get('clientProjectGet/').then(
                        (response) => {
                            console.log(response)
                            setCPData([
                                ...response.data,
                            ])
                            setIsCPDataLoading(false)
                        }
                    );
                }
            }
        );
    }, [setCPData]);

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
                if (error.response.data.detail == "Invalid token header. No credentials provided.") {
                    axiosInstance.get('CRUD/tags/').then(
                        (response) => {
                            console.log(response)
                            setTagsData([
                                ...response.data,
                            ])
                            setIsTagsDataLoading(false)
                        }
                    )
                }
            }
        );
    }, [setTagsData]);
    
    if (!isCPDataLoading && !isTagsDataLoading && !isLogDataLoading) {
        return (
            <div>
                <LogHeader CPData={CPData} tagsData={tagsData} />
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid 
                        rows={logData}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <LogHeader CPData={CPData} tagsData={tagsData} />
                <Skeleton />
            </div>
        )
    }
    
};

export default Home;