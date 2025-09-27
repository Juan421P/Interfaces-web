import { NumberPipeParseError } from './../errors/pipes/number-pipe-parse-error.js';

export class NumberPipe {
    static humanize(value, options = {}) {
        try {
            if (value === null || value === undefined) return options.default || '';

            const num = Number(value);
            if (isNaN(num)) return options.default || '';

            return num.toLocaleString(options.locale || 'en-US', {
                minimumFractionDigits: options.minFractionDigits || 0,
                maximumFractionDigits: options.maxFractionDigits || 2,
                style: options.currency ? 'currency' : undefined,
                currency: options.currency
            });
        } catch (error) {
            if (error instanceof NumberPipeParseError) {
                throw error;
            }
            throw new NumberPipeParseError(value, options, error);
        }
    }

    static normalize(value, options = {}) {
        try {
            if (value === null || value === undefined) return options.default || 0;

            if (typeof value === 'string') {
                value = value.replace(/[^\d.-]/g, '');
            }

            const num = Number(value);
            if (isNaN(num)) {
                throw new NumberPipeParseError(value, options, new Error('Invalid number'));
            }

            if (options.min !== undefined && num < options.min) {
                if (options.clamp) {
                    return options.min;
                }
                throw new NumberPipeParseError(value, options, new Error(`Number below minimum: ${options.min}`));
            }

            if (options.max !== undefined && num > options.max) {
                if (options.clamp) {
                    return options.max;
                }
                throw new NumberPipeParseError(value, options, new Error(`Number above maximum: ${options.max}`));
            }

            return num;
        } catch (error) {
            if (error instanceof NumberPipeParseError) {
                throw error;
            }
            throw new NumberPipeParseError(value, options, error);
        }
    }
}