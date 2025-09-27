import { DatePipeParseError } from './../errors/pipes/date-pipe-parse-error.js';

export class DatePipe {
    static humanize(value, options = {}) {
        try {
            if (value === null || value === undefined) return options.default || '';

            let date;

            if (value instanceof Date) {
                date = value;
            } else if (typeof value === 'number') {
                date = new Date(value < 1e12 ? value * 1000 : value);
            } else if (typeof value === 'string') {
                date = new Date(value);
            } else {
                return options.default || '';
            }

            if (isNaN(date.getTime())) {
                throw new DatePipeParseError(value, options, new Error('Invalid date'));
            }

            const format = options.format || 'medium';

            switch (format) {
                case 'short':
                    return date.toLocaleDateString(options.locale || 'en-US');
                case 'medium':
                    return date.toLocaleDateString(options.locale || 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                case 'long':
                    return date.toLocaleDateString(options.locale || 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                case 'datetime':
                    return date.toLocaleString(options.locale || 'en-US');
                case 'relative':
                    return this._relativeTime(date, options);
                case 'custom':
                    return this._formatCustom(date, options.pattern);
                default:
                    return date.toISOString().split('T')[0];
            }
        } catch (error) {
            if (error instanceof DatePipeParseError) {
                throw error;
            }
            throw new DatePipeParseError(value, options, error);
        }
    }

    static normalize(value, options = {}) {
        try {
            if (value === null || value === undefined) {
                return options.default || new Date().toISOString();
            }

            if (value instanceof Date) {
                return options.output === 'timestamp' ? value.getTime() : value.toISOString();
            }

            if (typeof value === 'number') {
                const date = new Date(value < 1e12 ? value * 1000 : value);
                if (isNaN(date.getTime())) {
                    throw new DatePipeParseError(value, options, new Error('Invalid date from number'));
                }
                return options.output === 'timestamp' ? date.getTime() : date.toISOString();
            }

            if (typeof value === 'string') {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    throw new DatePipeParseError(value, options, new Error('Invalid date from string'));
                }
                return options.output === 'timestamp' ? date.getTime() : date.toISOString();
            }

            throw new DatePipeParseError(value, options, new Error('Unsupported date type'));
        } catch (error) {
            if (error instanceof DatePipeParseError) {
                throw error;
            }
            throw new DatePipeParseError(value, options, error);
        }
    }

    static _relativeTime(date, options) {
        const now = new Date();
        const diffMs = now - date;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString(options.locale || 'en-US');
    }

    static _formatCustom(date, pattern) {
        const replacements = {
            'YYYY': date.getFullYear(),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'DD': String(date.getDate()).padStart(2, '0'),
            'HH': String(date.getHours()).padStart(2, '0'),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'ss': String(date.getSeconds()).padStart(2, '0')
        };

        return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match]);
    }
}