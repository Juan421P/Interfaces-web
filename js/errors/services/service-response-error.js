import { ServiceError } from './service-error';

export class ServiceResponseError extends ServiceError {
    constructor(serviceName, endpoint, responseData, expectedFormat) {
        super(serviceName, `Invalid response format from endpoint: ${endpoint}`, {
            endpoint,
            responseData,
            expectedFormat,
            type: 'response'
        });
        this.name = 'ServiceResponseError';
    }
}