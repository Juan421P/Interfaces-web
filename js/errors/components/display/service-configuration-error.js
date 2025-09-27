import { ComponentError } from '../base/component-error';

export class ServiceConfigurationError extends ComponentError {
    constructor(componentName, service, missingMethod) {
        super(componentName, `Service configuration error`, {
            service: service?.constructor?.name,
            missingMethod,
            availableMethods: service ? Object.getOwnPropertyNames(service) : []
        });
        this.name = 'ServiceConfigurationError';
        this.missingMethod = missingMethod;
    }
}