import axios from 'axios';

// Em desenvolvimento usa o proxy do Vite, em produção usa a API route do Vercel
const baseURL = import.meta.env.DEV 
  ? '/api' 
  : '/api'; // API routes do Vercel

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
