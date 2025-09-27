import { ComponentError } from '../base/component-error';

export class DataTransformError extends ComponentError {
    constructor(componentName, transformStep, originalData, originalError) {
        super(componentName, `Data transformation failed during '${transformStep}'`, {
            transformStep,
            originalDataSample: this._sampleData(originalData),
            originalError: originalError?.message
        });
        this.name = 'DataTransformError';
        this.transformStep = transformStep;
    }

    _sampleData(data) {
        if (Array.isArray(data)) {
            return data.slice(0, 3);
        }
        return data;
    }
}