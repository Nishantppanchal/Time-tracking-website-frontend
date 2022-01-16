import axiosInstance from './../Axios.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import './../Styles/Home.css';
import LogHeader from './LogHeader';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';



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
                (params.getValue(params.id, 'client') ? 
                    CPData.filter((data) => data.id == params.getValue(params.id, 'client') && data.type == 'clients')[0].name : 
                    CPData.filter((data) => data.id == params.getValue(params.id, 'project') && data.type == 'projects')[0].name
                ),
        },
        {}
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