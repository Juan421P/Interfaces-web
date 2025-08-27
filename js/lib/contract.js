const T = {
	string: (cfg = {}) => ({ type: 'string', ...cfg }),
	int: (cfg = {}) => ({ type: 'int', ...cfg }),
	number: (cfg = {}) => ({ type: 'number', ...cfg }),
	bool: (cfg = {}) => ({ type: 'bool', ...cfg }),
	date: (cfg = {}) => ({ type: 'date', ...cfg }),
	enum: (values, cfg = {}) => ({ type: 'enum', values, ...cfg }),
	array: (of, cfg = {}) => ({ type: 'array', of, ...cfg }),
	object: (shape, cfg = {}) => ({ type: 'object', shape, ...cfg }),
};

const coerce = {
	string: v => (v == null ? '' : String(v)),
	int: v => {
		const n = Number(v);
		return Number.isFinite(n) ? Math.trunc(n) : NaN;
	},
	number: v => {
		const n = Number(v);
		return Number.isFinite(n) ? n : NaN;
	},
	bool: v => {
		if (typeof v === 'boolean') return v;
		if (v === 'true' || v === '1' || v === 1 || v === 'Y') return true;
		if (v === 'false' || v === '0' || v === 0 || v === 'N') return false;
		return Boolean(v);
	},
	date: v => {
		const d = (v instanceof Date) ? v : new Date(v);
		return isNaN(d.getTime()) ? null : d;
	},
};

function validateField(spec, value, keyPath, errors, options) {
	const path = keyPath.join('.');
	const required = !!spec.required;

	if (value == null || value === '') {
		if (required && spec.default === undefined) {
			errors.push({ field: path, msg: 'Required' });
			return { ok: false, value };
		}
		if (spec.default !== undefined) {
			value = (typeof spec.default === 'function') ? spec.default() : spec.default;
		} else {
			return { ok: true, value: undefined };
		}
	}

	if (spec.coerce) {
		if (spec.type in coerce) value = coerce[spec.type](value);
		if (spec.type === 'array' && Array.isArray(value)) {
		}
	}

	switch (spec.type) {
		case 'string': {
			if (typeof value !== 'string') value = String(value ?? '');
			if (spec.trim) value = value.trim();
			if (spec.min != null && value.length < spec.min) {
				errors.push({ field: path, msg: `Min length ${spec.min}` });
			}
			if (spec.max != null && value.length > spec.max) {
				errors.push({ field: path, msg: `Max length ${spec.max}` });
			}
			if (spec.regex && !spec.regex.test(value)) {
				errors.push({ field: path, msg: 'Invalid format' });
			}
			break;
		}
		case 'int': {
			if (!Number.isInteger(value)) {
				errors.push({ field: path, msg: 'Not an integer' });
			} else {
				if (spec.min != null && value < spec.min) errors.push({ field: path, msg: `Min ${spec.min}` });
				if (spec.max != null && value > spec.max) errors.push({ field: path, msg: `Max ${spec.max}` });
			}
			break;
		}
		case 'number': {
			if (typeof value !== 'number' || !Number.isFinite(value)) {
				errors.push({ field: path, msg: 'Not a number' });
			} else {
				if (spec.min != null && value < spec.min) errors.push({ field: path, msg: `Min ${spec.min}` });
				if (spec.max != null && value > spec.max) errors.push({ field: path, msg: `Max ${spec.max}` });
			}
			break;
		}
		case 'bool': {
			if (typeof value !== 'boolean') errors.push({ field: path, msg: 'Not a boolean' });
			break;
		}
		case 'date': {
			if (!(value instanceof Date) || isNaN(value.getTime())) {
				errors.push({ field: path, msg: 'Invalid date' });
			}
			break;
		}
		case 'enum': {
			if (!spec.values.includes(value)) {
				errors.push({ field: path, msg: `Expected one of: ${spec.values.join(', ')}` });
			}
			break;
		}
		case 'array': {
			if (!Array.isArray(value)) {
				errors.push({ field: path, msg: 'Not an array' });
				break;
			}
			if (spec.min != null && value.length < spec.min) errors.push({ field: path, msg: `Min items ${spec.min}` });
			if (spec.max != null && value.length > spec.max) errors.push({ field: path, msg: `Max items ${spec.max}` });
			if (spec.of) {
				value = value.map((v, i) => {
					const res = validateField(spec.of, v, keyPath.concat(String(i)), errors, options);
					return res.value;
				});
			}
			break;
		}
		case 'object': {
			if (typeof value !== 'object' || value == null || Array.isArray(value)) {
				errors.push({ field: path, msg: 'Not an object' });
				break;
			}
			const out = {};
			for (const [k, childSpec] of Object.entries(spec.shape || {})) {
				const res = validateField(childSpec, value[k], keyPath.concat(k), errors, options);
				if (res.value !== undefined) out[k] = res.value;
			}
			value = out;
			break;
		}
		default:
			break;
	}

	if (typeof spec.refine === 'function') {
		const ok = spec.refine(value);
		if (!ok) errors.push({ field: path, msg: 'Custom validation failed' });
	}

	if (typeof spec.transform === 'function') {
		value = spec.transform(value);
	}

	return { ok: errors.length === 0, value };
}

function applyScope(input, schema, scope) {
	if (!scope) return input;
	const allowed = new Set(scope);
	const out = {};
	for (const k of Object.keys(schema)) {
		if (allowed.has(k) && input[k] !== undefined) out[k] = input[k];
	}
	return out;
}

export function makeContract({ schema, scopes = {}, refine }) {
	function validate(input, scopeName) {
		const scope = scopeName ? scopes[scopeName] : null;
		const filtered = scope ? applyScope(input || {}, schema, scope) : (input || {});
		const errors = [];
		const out = {};
		for (const [k, spec] of Object.entries(schema)) {
			if (scope && !scope.includes(k)) continue;
			const res = validateField(spec, filtered[k], [k], errors, {});
			if (res.value !== undefined) out[k] = res.value;
		}
		if (typeof refine === 'function') {
			const ok = refine(out);
			if (!ok) errors.push({ field: '$schema', msg: 'Schema-level validation failed' });
		}
		return { ok: errors.length === 0, errors, value: out };
	}

	function parse(input, scopeName) {
		const res = validate(input, scopeName);
		if (!res.ok) {
			const msg = res.errors.map(e => `${e.field}: ${e.msg}`).join(' | ');
			throw new Error(`[Contract] Invalid payload :: ${msg}`);
		}
		return res.value;
	}

	function pick(scopeName, input) {
		const scope = scopes[scopeName] || [];
		const out = {};
		for (const k of scope) if (k in (input || {})) out[k] = input[k];
		return out;
	}

	return {
		schema,
		scopes,
		types: T,
		validate,
		parse,
		pick,
	};
}