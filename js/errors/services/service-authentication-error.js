import { ServiceError } from './service-error';

export class ServiceAuthenticationError extends ServiceError {
    constructor(serviceName, endpoint) {
        super(serviceName, `Authentication failed for endpoint: ${endpoint}`, {
            endpoint,
            type: 'authentication'
        });
        this.name = 'ServiceAuthenticationError';
    }
}