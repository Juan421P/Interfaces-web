import { FormComponent } from './../base/form-component.js';

export class Select extends FormComponent {
    constructor(opts = {}) {
        super(opts);
        this.options = opts.options || [];
        this.multiple = opts.multiple || false;
    }
    
}