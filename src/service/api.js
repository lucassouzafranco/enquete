import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'http://45.178.181.60:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
