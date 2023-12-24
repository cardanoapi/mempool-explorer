
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000,
});

export default api;
