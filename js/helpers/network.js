const API_BASE = 'https://retoolapi.dev';

export async function fetchJSON(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) throw new Error(`Network error ${res.status}`);
    return res.json();
}

export function postJSON(path, data) {
    return fetchJSON(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}