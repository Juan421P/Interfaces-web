import { ComponentError } from '../base/component-error';

export class ComponentInitializationError extends ComponentError {
    constructor(componentName, hostSelector, originalError) {
        super(componentName, `Initialization failed - host element not found`, {
            hostSelector,
            originalError: originalError?.message
        });
        this.name = 'ComponentInitializationError';
        this.hostSelector = hostSelector;
    }
}