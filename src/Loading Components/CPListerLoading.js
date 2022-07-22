import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
// Import luxon component

// Import axios instance
// Import redux components



function CPListerLoading() {

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0rem 5rem'
      }}
    >
      <Stack
        direction='column'
        spacing={2}
        sx={{ width: '95%' }}
      >
        {Array.from(Array(5), (e, i) => {
            return (
                <Skeleton variant='rectangular' key={i} />
            )
        })}
      </Stack>
    </Box>
  );
}

export default CPListerLoading;