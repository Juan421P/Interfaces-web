const API_BASE = 'https://retoolapi.dev';

async function request(path, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) throw new Error(`Network error ${res.status}`);
    return res.json();
}

export function fetchJSON(path) {
    return request(path);
}

export function postJSON(path, data) {
    return request(path, 'POST', data);
}

export function putJSON(path, data) {
    return request(path, 'PUT', data);
}

export function patchJSON(path, data) {
    return request(path, 'PATCH', data);
}

export function deleteJSON(path) {
    return request(path, 'DELETE');
}