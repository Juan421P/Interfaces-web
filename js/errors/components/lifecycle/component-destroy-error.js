import { ComponentError } from '../base/component-error';

export class ComponentDestroyError extends ComponentError {
    constructor(componentName, cleanupStep, originalError) {
        super(componentName, `Component destruction failed during '${cleanupStep}'`, {
            cleanupStep,
            originalError: originalError?.message
        });
        this.name = 'ComponentDestroyError';
    }
}