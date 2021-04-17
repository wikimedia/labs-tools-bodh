import axios from 'axios';

export default axios.create({
    baseURL: 'https://bodh-backend.toolforge.org',
    withCredentials: true,
    mode: 'cors'
});
  