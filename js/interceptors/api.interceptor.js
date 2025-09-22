import { Network } from './../lib/network.js';

Network.interceptors.request.push(({ url, options }) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return { url, options };
});

Network.interceptors.response.push((data) => {
    if (data && data.result !== undefined) {
        return data.result;
    }
    return data;
});