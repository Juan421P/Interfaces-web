import { ComponentError } from '../base/component-error';

export class ComponentMountError extends ComponentError {
    constructor(componentName, mountPoint, originalError) {
        super(componentName, `Failed to mount component to DOM`, {
            mountPoint: mountPoint?.id || mountPoint?.selector,
            originalError: originalError?.message
        });
        this.name = 'ComponentMountError';
    }
}