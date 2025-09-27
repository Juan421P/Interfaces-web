export class ComponentError extends Error {
    constructor(componentName, message, details = {}) {
        super(`[${componentName}] ${message}`);
        this.name = 'ComponentError';
        this.componentName = componentName;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ComponentError);
        }
    }
}