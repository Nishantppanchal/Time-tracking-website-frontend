// Import the axios instance
import axiosInstance from '../../Axios';

function fetchLoadLogs(
  loadedLogsNumber,
  setLogData,
  logData,
  setAllLogsLoaded,
  setIsLogDataLoading
) {
  axiosInstance
    .get('CRUD/logs/', { params: { number: loadedLogsNumber } })
    .then((response) => {
      console.log(response.data);
      if (response.data.length > 0) {
        setLogData([...logData, ...response.data]);
      } else {
        setAllLogsLoaded(true); //To disable the load more button
      }
      setIsLogDataLoading(false);
    })
    .catch((error) => {
      console.log(error.response);
      if (
        error.response.data.detail ==
        'Invalid token header. No credentials provided.'
      ) {
        if (error.response.data.requestData.data.length > 0) {
          setLogData([...logData, ...error.response.data.requestData.data]);
        } else {
          setAllLogsLoaded(true);
        }
        setIsLogDataLoading(false);
      }
    });
}

export default fetchLoadLogs;
