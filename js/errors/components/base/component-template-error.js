import { ComponentError } from './component-error';

export class ComponentTemplateError extends ComponentError {
    constructor(componentName, templateUrl, reason) {
        super(componentName, `Template error: ${reason}`, { templateUrl, reason });
        this.name = 'ComponentTemplateError';
        this.templateUrl = templateUrl;
    }
}