import { CssBaseline, Skeleton } from '@mui/material';
import Header from '../Components/Header';
import LogListerLoading from './LogListerLoading';

function DashboardLoading() {
  return (
    <div>
      <CssBaseline />
      <Header page='dashboard' />
      <Skeleton
        variant='rectangular'
        height='273px'
        sx={{ margin: '1rem 1rem 0rem', borderRadius: '5px' }}
      />
      <LogListerLoading />
    </div>
  );
}

export default DashboardLoading;
