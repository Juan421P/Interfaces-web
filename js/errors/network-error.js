export class NetworkError extends Error {
    constructor(message, status) {
        super(message || 'Network request failed');
        this.name = 'NetworkError';
        this.status = status;
    }
}