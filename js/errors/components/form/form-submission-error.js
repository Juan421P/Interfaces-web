import { ComponentError } from '../base/component-error';

export class FormSubmissionError extends ComponentError {
    constructor(componentName, submitData, originalError) {
        super(componentName, 'Form submission failed', {
            submitData: this._sanitizeFieldData(submitData),
            originalError: originalError?.message
        });
        this.name = 'FormSubmissionError';
        this.originalError = originalError;
    }

    _sanitizeFieldData(data) {
        const sanitized = { ...data };
        if (sanitized.password) sanitized.password = '***';
        return sanitized;
    }
}