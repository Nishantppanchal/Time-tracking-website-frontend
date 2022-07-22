// Import MUI components
import Grid from '@mui/material/Grid';
import './../Styles/Home.css';

import Header from '../Components/Header';
// Import luxon component
import { CssBaseline, Typography } from '@mui/material';
import CPListerLoading from './CPListerLoading';

function ClientsAndProjectsLoading() {
    return (
        <>
          <CssBaseline />
          <Header page='clients and projects' />
          <Grid container spacing={2} justifyContent='center' alignItems='flex-start' margin='1rem'>
            <Grid item xs={6}>
              <Typography variant='h6' width='100%' align='center'>Clients</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h6' width='100%' align='center'>Projects</Typography>
            </Grid>
            <Grid item xs={6}>
              <CPListerLoading />
            </Grid>
            <Grid item xs={6}>
              <CPListerLoading />
            </Grid>
          </Grid>
        </>
      );
}

export default ClientsAndProjectsLoading;