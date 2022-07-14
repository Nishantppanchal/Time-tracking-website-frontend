import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';

function LogListerLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        direction='column'
        spacing={2}
        sx={{ width: '95%', marginTop: '2rem' }}
      >
        <Stack
          direction='row'
          spacing={1}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '10%' }}>
            DATE
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '25%' }}>
            CLIENT/PROJECT
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 'bold', width: '55%' }}>
            DESCRIPTION
          </Typography>
          <span style={{ width: '10%' }}></span>
        </Stack>
        {Array.from(Array(5), (e, i) => {
            return (
                <Skeleton variant='rectangular' key={i} />
            )
        })}
      </Stack>
    </Box>
  );
}

export default LogListerLoading;