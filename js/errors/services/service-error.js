export class ServiceError extends Error {
    constructor(serviceName, message, details = {}) {
        super(`[${serviceName}] ${message}`);
        this.name = 'ServiceError';
        this.serviceName = serviceName;
        this.details = details;
        this.timestamp = new Date().toISOString();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServiceError);
        }
    }
}