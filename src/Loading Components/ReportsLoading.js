import { Skeleton } from '@mui/material';

function ReportsLoading() {
  return (
    <Skeleton
      sx={{
        padding: '1rem',
        margin: '1rem',
        width: 'calc(100% - 2rem)',
        height: '165.50px',
      }}
    />
  );
}

export default ReportsLoading;
