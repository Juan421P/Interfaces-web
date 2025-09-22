import { Network } from './../lib/network.js';

Network.interceptors.error.push((error) => {
    if (error.status === 401) {
        sessionStorage.clear();
        localStorage.removeItem('authToken');
        window.location.hash = '#login';
    }
    return error;
});

Network.interceptors.error.push((error) => {
    if (error.status === 400 && Array.isArray(error.details)) {
        error.message = `[Contract] Invalid payload :: ${error.details.join(' | ')}`;
    }
    return error;
});
