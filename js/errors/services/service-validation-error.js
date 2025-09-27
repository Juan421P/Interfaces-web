import { ServiceError } from './service-error';

export class ServiceValidationError extends ServiceError {
    constructor(serviceName, endpoint, validationErrors, inputData) {
        super(serviceName, `Validation failed for endpoint: ${endpoint}`, {
            endpoint,
            validationErrors,
            inputData: ServiceValidationError._sanitizeData(inputData),
            type: 'validation'
        });
        this.name = 'ServiceValidationError';
        this.validationErrors = validationErrors;
    }

    static _sanitizeData(data) {
        if (!data || typeof data !== 'object') return data;

        const sanitized = { ...data };
        if (sanitized.password) sanitized.password = '***';
        if (sanitized.token) sanitized.token = '***';
        if (sanitized.email) sanitized.email = '***@***.***';

        return sanitized;
    }
}