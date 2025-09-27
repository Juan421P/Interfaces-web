import { ServiceError } from './service-error';

export class ServiceNetworkError extends ServiceError {
    constructor(serviceName, endpoint, status, statusText) {
        super(serviceName, `Network error: ${status} ${statusText}`, {
            endpoint,
            status,
            statusText,
            type: 'network'
        });
        this.name = 'ServiceNetworkError';
        this.endpoint = endpoint;
        this.status = status;
    }
}