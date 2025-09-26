import { Network } from './../lib/network.js';

Network.interceptors.request.push(({ url, options }) => {
    return { url, options };
});

Network.interceptors.response.push((data) => {
    if (data && data.result !== undefined) {
        return data.result;
    }
    return data;
});