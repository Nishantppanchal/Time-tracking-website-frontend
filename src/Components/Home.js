import axiosInstance from './../Axios.js';

function Home () {
    axiosInstance.get('http://127.0.0.1:8000/api/test/')

    return (null)
};

export default Home;