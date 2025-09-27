import { ComponentError } from '../base/component-error.js';

export class DataLoadError extends ComponentError {
    constructor(componentName, serviceName, originalError) {
        super(componentName, `Failed to load data from service '${serviceName}'`, {
            serviceName,
            originalError: originalError?.message,
            statusCode: originalError?.status
        });
        this.name = 'DataLoadError';
        this.serviceName = serviceName;
        this.originalError = originalError;
    }
}