import { ComponentError } from '../base/component-error';

export class FormValidationError extends ComponentError {
    constructor(componentName, fieldName, validationRules, value) {
        super(componentName, `Validation failed for field '${fieldName}'`, {
            fieldName,
            validationRules,
            value,
            failedRules: validationRules.filter(rule => !rule.validate(value))
        });
        this.name = 'FormValidationError';
        this.fieldName = fieldName;
    }
}