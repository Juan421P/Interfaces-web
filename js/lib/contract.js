import { ValidationError } from '../errors/validation-error.js';
import { ContractScopeError } from '../errors/contract-scope-error.js';

export class Contract {
	constructor({ schema = {}, scopes = {} } = {}) {
		if (!schema || typeof schema !== 'object') {
			throw new TypeError('Contract schema must be an object.');
		}
		this.schema = schema;
		this.scopes = scopes;
	}

	static types = {
		string: (opts = {}) => ({ type: 'string', ...opts }),
		number: (opts = {}) => ({ type: 'number', ...opts }),
		boolean: (opts = {}) => ({ type: 'boolean', ...opts }),
		enum: (values, opts = {}) => ({ type: 'enum', values, ...opts }),
		date: (opts = {}) => ({ type: 'date', ...opts }),
	};

	_validateField(key, value, rules) {
		const errors = [];

		if (rules.required && (value === undefined || value === null || value === '')) {
			errors.push(`${key} is required`);
			return errors;
		}

		if (value === undefined || value === null || value === '') {
			return errors;
		}

		switch (rules.type) {
			case 'string':
				if (typeof value !== 'string') {
					errors.push(`${key} must be a string`);
					break;
				}
				if (rules.min && value.length < rules.min) {
					errors.push(`${key} must be at least ${rules.min} characters`);
				}
				if (rules.max && value.length > rules.max) {
					errors.push(`${key} must be at most ${rules.max} characters`);
				}
				if (rules.regex && !rules.regex.test(value)) {
					errors.push(`${key} format is invalid`);
				}
				break;

			case 'number':
				if (typeof value !== 'number' || Number.isNaN(value)) {
					errors.push(`${key} must be a number`);
					break;
				}
				if (rules.min !== undefined && value < rules.min) {
					errors.push(`${key} must be >= ${rules.min}`);
				}
				if (rules.max !== undefined && value > rules.max) {
					errors.push(`${key} must be <= ${rules.max}`);
				}
				break;

			case 'boolean':
				if (typeof value !== 'boolean') {
					errors.push(`${key} must be a boolean`);
				}
				break;

			case 'enum':
				if (!rules.values?.includes(value)) {
					errors.push(`${key} must be one of: ${rules.values.join(', ')}`);
				}
				break;

			case 'date':
				if (isNaN(Date.parse(value))) {
					errors.push(`${key} must be a valid date`);
				}
				break;

			default:
				errors.push(`${key} has unknown type ${rules.type}`);
		}

		return errors;
	}

	parse(data, scope) {
		if (!data || typeof data !== 'object') {
			throw new TypeError('Contract.parse requires an object');
		}

		let schema = this.schema;

		if (scope) {
			if (!this.scopes || !this.scopes[scope]) {
				throw new ContractScopeError(scope);
			}
			schema = Object.fromEntries(
				this.scopes[scope].map(field => [field, this.schema[field]])
			);
		}

		const parsed = {};
		const errors = {};

		for (const [key, rules] of Object.entries(schema)) {
			const value = data[key];
			const fieldErrors = this._validateField(key, value, rules);

			if (fieldErrors.length > 0) {
				errors[key] = fieldErrors;
			} else if (value !== undefined) {
				parsed[key] = value;
			}
		}

		if (Object.keys(errors).length > 0) {
			throw new ValidationError(errors);
		}

		return parsed;
	}

	describe(scope) {
		if (scope) {
			if (!this.scopes || !this.scopes[scope]) {
				throw new ContractScopeError(scope);
			}
			return this.scopes[scope];
		}
		return this.schema;
	}
}
