import { ValidationError } from '../errors/validation/validation-error.js';
import { ContractScopeError } from '../errors/contract/contract-scope-error.js';
import { PipeManager } from '../lib/pipe-manager.js';
import { PipeParseError } from '../errors/pipes/pipe-parse-error.js';

export class Contract {

	constructor({ schema = {}, scopes = {}, pipes = {} } = {}) {
		if (!schema || typeof schema !== 'object') {
			throw new TypeError('Contract schema must be an object.');
		}
		this.schema = schema;
		this.scopes = scopes;
		this.pipes = pipes;
	}

	getPrimaryKey() {
		const possibleKeys = ['id', 'ID', `${this.constructor.name.replace('Contract', '').toLowerCase()}ID`];

		for (const key of possibleKeys) {
			if (this.schema[key]) return key;
		}

		return Object.keys(this.schema)[0];
	}

	static _toMs(v) {
		if (v instanceof Date) return v.getTime();
		if (typeof v === 'number' && Number.isFinite(v)) {
			return v < 1e12 ? v * 1000 : v;
		}
		if (typeof v === 'string') {
			const p = Date.parse(v);
			return Number.isNaN(p) ? NaN : p;
		}
		return NaN;
	}

	static types = {
		string: (opts = {}) => ({ type: 'string', ...opts }),
		number: (opts = {}) => ({ type: 'number', ...opts }),
		boolean: (opts = {}) => ({ type: 'boolean', ...opts }),
		enum: (values, opts = {}) => ({ type: 'enum', values, ...opts }),
		date: (opts = {}) => ({ type: 'date', ...opts }),
		timestamp: (opts = {}) => ({ type: 'timestamp', ...opts }),
	};

	_validateFieldWithPipes(key, value, rules) {
		const errors = [];

		if (rules.required && (value === undefined || value === null || value === '')) {
			errors.push(`${key} is required`);
			return errors;
		}

		if (value === undefined || value === null || value === '') {
			return errors;
		}

		// Use pipes for type validation and normalization
		try {
			// First, normalize the value using pipes to ensure correct type
			const normalizedValue = PipeManager.normalize(value, rules.type, rules);

			// Then validate using pipe-based rules
			switch (rules.type) {
				case 'string':
					if (typeof normalizedValue !== 'string') {
						errors.push(`${key} must be a string`);
						break;
					}
					if (rules.min && normalizedValue.length < rules.min) {
						errors.push(`${key} must be at least ${rules.min} characters`);
					}
					if (rules.max && normalizedValue.length > rules.max) {
						errors.push(`${key} must be at most ${rules.max} characters`);
					}
					if (rules.regex && !rules.regex.test(normalizedValue)) {
						errors.push(`${key} format is invalid`);
					}
					break;

				case 'number':
					if (typeof normalizedValue !== 'number' || Number.isNaN(normalizedValue)) {
						errors.push(`${key} must be a number`);
						break;
					}
					if (rules.min !== undefined && normalizedValue < rules.min) {
						errors.push(`${key} must be >= ${rules.min}`);
					}
					if (rules.max !== undefined && normalizedValue > rules.max) {
						errors.push(`${key} must be <= ${rules.max}`);
					}
					break;

				case 'boolean':
					if (typeof normalizedValue !== 'boolean') {
						errors.push(`${key} must be a boolean`);
					}
					break;

				case 'enum':
					if (!rules.values?.includes(normalizedValue)) {
						errors.push(`${key} must be one of: ${rules.values.join(', ')}`);
					}
					break;

				case 'date':
				case 'timestamp': {
					const ms = Contract._toMs(normalizedValue);
					if (Number.isNaN(ms)) {
						errors.push(`${key} must be a valid date/timestamp`);
						break;
					}

					if (rules.min !== undefined) {
						const minMs = Contract._toMs(rules.min);
						if (!Number.isFinite(minMs) || ms < minMs) {
							errors.push(`${key} must be >= ${rules.min}`);
						}
					}
					if (rules.max !== undefined) {
						const maxMs = Contract._toMs(rules.max);
						if (!Number.isFinite(maxMs) || ms > maxMs) {
							errors.push(`${key} must be <= ${rules.max}`);
						}
					}
					break;
				}

				default:
					errors.push(`${key} has unknown type ${rules.type}`);
			}

		} catch (pipeError) {
			if (pipeError instanceof PipeParseError) {
				errors.push(`${key} ${pipeError.message}`);
			} else {
				errors.push(`${key} failed pipe validation: ${pipeError.message}`);
			}
		}

		return errors;
	}

	_validateField(key, value, rules) {
		if (rules.type && PipeManager.pipes[rules.type]) {
			return this._validateFieldWithPipes(key, value, rules);
		}

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
			case 'timestamp': {
				const ms = Contract._toMs(value);
				if (Number.isNaN(ms)) {
					errors.push(`${key} must be a valid date/timestamp`);
					break;
				}

				if (rules.min !== undefined) {
					const minMs = Contract._toMs(rules.min);
					if (!Number.isFinite(minMs) || ms < minMs) {
						errors.push(`${key} must be >= ${rules.min}`);
					}
				}
				if (rules.max !== undefined) {
					const maxMs = Contract._toMs(rules.max);
					if (!Number.isFinite(maxMs) || ms > maxMs) {
						errors.push(`${key} must be <= ${rules.max}`);
					}
				}
				break;
			}

			default:
				errors.push(`${key} has unknown type ${rules.type}`);
		}

		return errors;
	}

	parse(data, scope, { usePipes = true } = {}) {
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
			let value = data[key];

			if ((value === undefined || value === null || value === '') && rules.default !== undefined) {
				value = typeof rules.default === 'function' ? rules.default() : rules.default;
			}

			if (usePipes && rules.type && value !== undefined && value !== null) {
				try {
					value = PipeManager.normalize(value, rules.type, rules);
				} catch (pipeError) {
					errors[key] = [`Pipe normalization failed: ${pipeError.message}`];
					continue;
				}
			}

			if (rules.trim && typeof value === 'string') {
				value = value.trim();
			}

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

	humanize(data, scope) {
		const parsed = this.parse(data, scope, { usePipes: false });

		const humanized = {};
		for (const [key, value] of Object.entries(parsed)) {
			const rules = this.schema[key];
			if (rules && rules.type) {
				try {
					humanized[key] = PipeManager.humanize(value, rules.type, {
						...rules,
						...this.pipes[key]
					});
				} catch (error) {
					humanized[key] = value;
					console.warn(`Failed to humanize field ${key}:`, error);
				}
			} else {
				humanized[key] = value;
			}
		}

		return humanized;
	}

	validateWithPipes(data, scope) {
		const errors = {};
		const parsed = {};

		let schema = this.schema;
		if (scope) {
			if (!this.scopes || !this.scopes[scope]) {
				throw new ContractScopeError(scope);
			}
			schema = Object.fromEntries(
				this.scopes[scope].map(field => [field, this.schema[field]])
			);
		}

		for (const [key, rules] of Object.entries(schema)) {
			let value = data[key];

			if ((value === undefined || value === null || value === '') && rules.default !== undefined) {
				value = typeof rules.default === 'function' ? rules.default() : rules.default;
			}

			if (rules.required && (value === undefined || value === null || value === '')) {
				errors[key] = [`${key} is required`];
				continue;
			}

			if (value === undefined || value === null || value === '') {
				continue;
			}

			try {
				const normalized = PipeManager.normalize(value, rules.type, rules);
				parsed[key] = normalized;

				if (rules.type === 'string' && rules.min && normalized.length < rules.min) {
					errors[key] = [`${key} must be at least ${rules.min} characters`];
				}
				if (rules.type === 'string' && rules.max && normalized.length > rules.max) {
					errors[key] = [`${key} must be at most ${rules.max} characters`];
				}
				if (rules.regex && !rules.regex.test(normalized)) {
					errors[key] = [`${key} format is invalid`];
				}

			} catch (pipeError) {
				errors[key] = [`${key} validation failed: ${pipeError.message}`];
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