import { ComponentError } from './component-error';

export class ComponentConfigurationError extends ComponentError {
    constructor(componentName, missingProperty, expectedType = null) {
        const message = expectedType
            ? `Missing required property '${missingProperty}' of type ${expectedType}`
            : `Missing required property '${missingProperty}'`;

        super(componentName, `Configuration error: ${message}`, {
            missingProperty,
            expectedType
        });
        this.name = 'ComponentConfigurationError';
        this.missingProperty = missingProperty;
    }
}