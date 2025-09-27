import { StringPipeParseError } from './../errors/pipes/string-pipe-error.js';

export class StringPipe {
    static humanize(value, options = {}) {
        try {
            if (value === null || value === undefined) return options.default || '';

            let result = String(value);

            if (options.trim) {
                result = result.trim();
            }

            if (options.capitalize === 'first') {
                result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
            } else if (options.capitalize === 'words') {
                result = result.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            } else if (options.capitalize === 'all') {
                result = result.toUpperCase();
            } else if (options.capitalize === 'none') {
                result = result.toLowerCase();
            }

            if (options.maxLength && result.length > options.maxLength) {
                result = result.substring(0, options.maxLength) + (options.ellipsis || '...');
            }

            if (options.padStart) {
                result = result.padStart(options.padStart.length, options.padStart.char || ' ');
            }
            if (options.padEnd) {
                result = result.padEnd(options.padEnd.length, options.padEnd.char || ' ');
            }

            return result;
        } catch (error) {
            if (error instanceof StringPipeParseError) {
                throw error;
            }
            throw new StringPipeParseError(value, options, error);
        }
    }

    static normalize(value, options = {}) {
        try {
            if (value === null || value === undefined) return options.default || '';

            let result = String(value);

            if (options.trim) {
                result = result.trim();
            }

            if (options.lowercase) {
                result = result.toLowerCase();
            } else if (options.uppercase) {
                result = result.toUpperCase();
            }

            if (options.minLength && result.length < options.minLength) {
                if (options.padEnd) {
                    result = result.padEnd(options.minLength, options.padEnd.char || ' ');
                } else {
                    throw new StringPipeParseError(value, options, new Error(`String too short: minimum ${options.minLength} characters`));
                }
            }

            if (options.maxLength && result.length > options.maxLength) {
                if (options.truncate) {
                    result = result.substring(0, options.maxLength);
                } else {
                    throw new StringPipeParseError(value, options, new Error(`String too long: maximum ${options.maxLength} characters`));
                }
            }

            if (options.regex && !options.regex.test(result)) {
                throw new StringPipeParseError(value, options, new Error(`String does not match required pattern`));
            }

            if (options.enum && !options.enum.includes(result)) {
                throw new StringPipeParseError(value, options, new Error(`String not in allowed values: ${options.enum.join(', ')}`));
            }

            return result;
        } catch (error) {
            if (error instanceof StringPipeParseError) {
                throw error;
            }
            throw new StringPipeParseError(value, options, error);
        }
    }
}