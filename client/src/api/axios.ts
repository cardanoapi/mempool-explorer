import axios from 'axios';

import environments from '@app/configs/environments';

const BASE_URL = environments.API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    timeout: 30000
});

export default api;
