import { ServiceError } from './service-error';

export class ServiceEndpointError extends ServiceError {
    constructor(serviceName, endpoint, method, reason) {
        super(serviceName, `Endpoint error: ${method} ${endpoint} - ${reason}`, {
            endpoint,
            method,
            reason,
            type: 'endpoint'
        });
        this.name = 'ServiceEndpointError';
    }
}