import { ComponentError } from '../base/component-error';

export class FormContractError extends ComponentError {
    constructor(componentName, contractErrors, fieldData) {
        super(componentName, 'Contract validation failed', {
            contractErrors,
            fieldData: this._sanitizeFieldData(fieldData)
        });
        this.name = 'ContractValidationError';
        this.contractErrors = contractErrors;
    }

    _sanitizeFieldData(fieldData) {
        const sanitized = { ...fieldData };
        if (sanitized.contrasena) sanitized.contrasena = '***';
        if (sanitized.password) sanitized.password = '***';
        if (sanitized.email) sanitized.email = '***@***.***';
        return sanitized;
    }
}