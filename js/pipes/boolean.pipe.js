import { BooleanPipeParseError } from './../errors/pipes/boolean-pipe-parse-error.js';

export class BooleanPipe {
    static humanize(value, options = {}) {
        try {
            if (value === null || value === undefined) return options.default || '';

            const bool = this._normalizeToBoolean(value, options);

            if (options.format === 'yesno') {
                return bool ? (options.yesText || 'Sí') : (options.noText || 'No');
            } else if (options.format === 'onoff') {
                return bool ? (options.onText || 'On') : (options.offText || 'Off');
            } else if (options.format === 'yn') {
                return bool ? (options.yesText || 'Y') : (options.noText || 'N');
            } else if (options.format === 'sn') {
                return bool ? (options.yesText || 'S') : (options.noText || 'N');
            } else if (options.format === '10') {
                return bool ? '1' : '0';
            } else if (options.format === 'custom' && options.truthy !== undefined) {
                return bool ? options.truthy : options.falsy;
            } else if (options.format === 'boolean') {
                return bool ? 'true' : 'false';
            }

            return bool.toString();
        } catch (error) {
            if (error instanceof BooleanPipeParseError) {
                throw error;
            }
            throw new BooleanPipeParseError(value, options, error);
        }
    }

    static normalize(value, options = {}) {
        try {
            if (value === null || value === undefined) {
                const defaultValue = options.default !== undefined ? options.default : false;
                return this._booleanToNumber(defaultValue);
            }

            const bool = this._normalizeToBoolean(value, options);
            return this._booleanToNumber(bool);
        } catch (error) {
            if (error instanceof BooleanPipeParseError) {
                throw error;
            }
            throw new BooleanPipeParseError(value, options, error);
        }
    }

    static _normalizeToBoolean(value, options = {}) {
        if (typeof value === 'boolean') return value;

        if (typeof value === 'number') {
            if (value === 1) return true;
            if (value === 0) return false;
            throw new BooleanPipeParseError(value, options, new Error(`Invalid number for boolean: ${value}. Must be 1 or 0.`));
        }

        if (typeof value === 'string') {
            const trimmed = value.trim().toLowerCase();

            if (['true', 't', 'yes', 'y', 'sí', 's', 'on', '1', 'verdadero', 'v'].includes(trimmed)) {
                return true;
            }

            if (['false', 'f', 'no', 'n', 'off', '0', 'falso', 'f'].includes(trimmed)) {
                return false;
            }

            throw new BooleanPipeParseError(value, options, new Error(`Invalid string for boolean: "${value}". Must be one of: true/false, yes/no, y/n, s/n, on/off, 1/0`));
        }

        if (value === 1) return true;
        if (value === 0) return false;

        throw new BooleanPipeParseError(value, options, new Error(`Unsupported type for boolean: ${typeof value}`));
    }

    static _booleanToNumber(bool) {
        return bool ? 1 : 0;
    }

    static fromDatabase(value, options = {}) {
        try {
            if (value === 1) return true;
            if (value === 0) return false;

            return this._normalizeToBoolean(value, options);
        } catch (error) {
            if (error instanceof BooleanPipeParseError) {
                throw error;
            }
            throw new BooleanPipeParseError(value, options, error);
        }
    }

    static toDatabase(bool) {
        return this._booleanToNumber(bool);
    }
}