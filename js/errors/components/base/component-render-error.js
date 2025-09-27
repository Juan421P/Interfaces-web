import { ComponentError } from './component-error';

export class ComponentRenderError extends ComponentError {
    constructor(componentName, renderStep, originalError = null) {
        super(componentName, `Render failed during ${renderStep}`, {
            renderStep,
            originalError: originalError?.message
        });
        this.name = 'ComponentRenderError';
        this.renderStep = renderStep;
        this.originalError = originalError;
    }
}