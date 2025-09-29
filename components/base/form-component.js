import { Component } from './component.js';

export class FormComponent extends Component {
    static getTemplate() {
        return `<div class="form-component">Form Component Template</div>`;
    }

    constructor(opts = {}) {
        super(opts);

        this.name = opts.name || '';
        this.label = opts.label || '';
        this.required = opts.required || false;
        this.disabled = opts.disabled || false;
        this.value = opts.value || '';
        this.placeholder = opts.placeholder || '';
        this.validationRules = opts.validationRules || [];
        this.errorMessage = opts.errorMessage || '';

        this.contract = opts.contract || null;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
        if (this.isRendered) {
            this._updateValue();
        }
    }

    validate() {
        if (!this.required && !this.value) return true;

        if (this.contract) {
            try {
                this.contract.parse({ [this.name]: this.value }, 'create');
                this._clearError();
                return true;
            } catch (error) {
                this._showError(error.message);
                return false;
            }
        }

        for (const rule of this.validationRules) {
            if (!rule.validate(this.value)) {
                this._showError(rule.message);
                return false;
            }
        }

        this._clearError();
        return true;
    }

    _showError(message) {
        this.errorMessage = message;
        this.host.classList.add('error');
    }

    _clearError() {
        this.errorMessage = '';
        this.host.classList.remove('error');
    }

    _updateValue() {
    }
}