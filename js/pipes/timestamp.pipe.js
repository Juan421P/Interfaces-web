import { TimestampPipeParseError } from './../errors/pipes/timestamp-pipe-parse-error.js';

export class TimestampPipe {
    static humanize(value, options = {}) {
        if (value === null || value === undefined) return options.default || '';

        let timestamp;

        try {
            if (value instanceof Date) {
                timestamp = value.getTime();
            } else if (typeof value === 'number') {
                timestamp = value < 1e12 ? value * 1000 : value;
            } else if (typeof value === 'string') {
                timestamp = this._parseTimestampString(value);
            } else {
                return options.default || '';
            }

            if (!this._isValidTimestamp(timestamp)) {
                return options.default || '';
            }
        } catch (error) {
            if (error instanceof TimestampPipeParseError) {
                throw error;
            }
            throw new TimestampPipeParseError(value, 'timestamp', options, error);
        }

        const format = options.format || 'relative';

        switch (format) {
            case 'relative':
                return this._relativeTime(timestamp, options);

            case 'absolute':
                return this._absoluteTime(timestamp, options);

            case 'timeago':
                return this._timeAgo(timestamp, options);

            case 'calendar':
                return this._calendarTime(timestamp, options);

            case 'since':
                return this._timeSince(timestamp, options);

            case 'custom':
                return this._formatCustom(timestamp, options.pattern, options);

            default:
                return this._defaultFormat(timestamp, options);
        }
    }

    static normalize(value, options = {}) {
        if (value === null || value === undefined) {
            const defaultValue = options.default !== undefined
                ? options.default
                : (options.useCurrent !== false ? Date.now() : null);
            return defaultValue;
        }

        let timestamp;

        try {
            if (value instanceof Date) {
                timestamp = value.getTime();
            } else if (typeof value === 'number') {
                timestamp = value < 1e12 ? value * 1000 : value;
            } else if (typeof value === 'string') {
                timestamp = this._parseTimestampString(value);
            } else {
                throw new TimestampPipeParseError(value, 'timestamp', options);
            }

            if (!this._isValidTimestamp(timestamp)) {
                throw new TimestampPipeParseError(value, 'timestamp', options);
            }
        } catch (error) {
            if (error instanceof TimestampPipeParseError) {
                throw error;
            }
            throw new TimestampPipeParseError(value, 'timestamp', options, error);
        }

        if (options.precision) {
            timestamp = this._applyPrecision(timestamp, options.precision);
        }

        if (options.timezone) {
            timestamp = this._adjustTimezone(timestamp, options.timezone);
        }

        return options.output === 'seconds' ? Math.floor(timestamp / 1000) : timestamp;
    }

    static _parseTimestampString(value) {
        const isoParse = Date.parse(value);
        if (!isNaN(isoParse)) return isoParse;

        const formats = [
            /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/,
            /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{2}):(\d{2})$/
        ];

        for (const regex of formats) {
            const match = value.match(regex);
            if (match) {
                const date = new Date(
                    parseInt(match[3] || match[1]),
                    parseInt((match[1] || match[2])) - 1,
                    parseInt(match[2] || match[3]),
                    parseInt(match[4]),
                    parseInt(match[5]),
                    parseInt(match[6])
                );
                return date.getTime();
            }
        }

        if (/^\d+$/.test(value)) {
            const num = parseInt(value);
            return num < 1e12 ? num * 1000 : num;
        }

        throw new TimestampPipeParseError(value, 'timestamp', {}, new Error('Unable to parse timestamp string'));
    }

    static _isValidTimestamp(timestamp) {
        return typeof timestamp === 'number' &&
            !isNaN(timestamp) &&
            timestamp > 0 &&
            timestamp < 8640000000000000;
    }

    static _applyPrecision(timestamp, precision) {
        const date = new Date(timestamp);

        switch (precision) {
            case 'second':
                date.setMilliseconds(0);
                break;
            case 'minute':
                date.setSeconds(0, 0);
                break;
            case 'hour':
                date.setMinutes(0, 0, 0);
                break;
            case 'day':
                date.setHours(0, 0, 0, 0);
                break;
            case 'month':
                date.setDate(1);
                date.setHours(0, 0, 0, 0);
                break;
            case 'year':
                date.setMonth(0, 1);
                date.setHours(0, 0, 0, 0);
                break;
        }

        return date.getTime();
    }

    static _adjustTimezone(timestamp, timezone) {
        if (typeof timezone === 'number') {
            return timestamp + (timezone * 3600000);
        }

        return timestamp;
    }

    static _relativeTime(timestamp, options) {
        const now = Date.now();
        const diff = now - timestamp;
        const absDiff = Math.abs(diff);

        const intervals = [
            { label: 'años', labelSingular: 'año', milliseconds: 31536000000 },
            { label: 'meses', labelSingular: 'mes', milliseconds: 2592000000 },
            { label: 'semanas', labelSingular: 'semana', milliseconds: 604800000 },
            { label: 'días', labelSingular: 'día', milliseconds: 86400000 },
            { label: 'horas', labelSingular: 'hora', milliseconds: 3600000 },
            { label: 'minutos', labelSingular: 'minuto', milliseconds: 60000 },
            { label: 'segundos', labelSingular: 'segundo', milliseconds: 1000 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(absDiff / interval.milliseconds);
            if (count >= 1) {
                const isSingular = count === 1;
                const label = isSingular ? interval.labelSingular : interval.label;

                if (options.compact) {
                    const compactLabel = interval.labelSingular.charAt(0);
                    return diff < 0 ? `en ${count}${compactLabel}` : `Hace ${count}${compactLabel}`;
                }

                return diff < 0 ? `en ${count} ${label}` : `Hace ${count} ${label}`;
            }
        }

        return diff < 0 ? 'pronto' : 'ahora mismo';
    }

    static _absoluteTime(timestamp, options) {
        const date = new Date(timestamp);
        const locale = options.locale || 'es-ES';

        if (options.compact) {
            return date.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: timestamp < new Date().getTime() - 31536000000 ? 'numeric' : undefined
            });
        }

        return date.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: options.hour12 !== false
        });
    }

    static _timeAgo(timestamp, options) {
        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 60000) return 'Hace un momento';

        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return minutes === 1 ? 'Hace 1 minuto' : `Hace ${minutes} minutos`;
        }

        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return hours === 1 ? 'Hace 1 hora' : `Hace ${hours} horas`;
        }

        const date = new Date(timestamp);
        return date.toLocaleDateString(options.locale || 'es-ES', {
            month: 'short',
            day: 'numeric'
        });
    }

    static _calendarTime(timestamp, options) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        const timeString = date.toLocaleTimeString(options.locale || 'es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: options.hour12 !== false
        });

        if (isToday) {
            return `Hoy a las ${timeString}`;
        } else if (isYesterday) {
            return `Ayer a las ${timeString}`;
        } else if (isTomorrow) {
            return `Mañana a las ${timeString}`;
        } else {
            return date.toLocaleDateString(options.locale || 'es-ES', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: timestamp < new Date().getTime() - 31536000000 ? 'numeric' : undefined
            });
        }
    }

    static _timeSince(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 0) return 'en el futuro';

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            const daysText = days === 1 ? 'día' : 'días';
            const hoursText = (hours % 24) === 1 ? 'hora' : 'horas';
            return `Hace ${days} ${daysText} ${hours % 24} ${hoursText}`;
        }
        if (hours > 0) {
            const hoursText = hours === 1 ? 'hora' : 'horas';
            const minutesText = (minutes % 60) === 1 ? 'minuto' : 'minutos';
            return `Hace ${hours} ${hoursText} ${minutes % 60} ${minutesText}`;
        }
        if (minutes > 0) {
            const minutesText = minutes === 1 ? 'minuto' : 'minutos';
            const secondsText = (seconds % 60) === 1 ? 'segundo' : 'segundos';
            return `Hace ${minutes} ${minutesText} ${seconds % 60} ${secondsText}`;
        }

        const secondsText = seconds === 1 ? 'segundo' : 'segundos';
        return `Hace ${seconds} ${secondsText}`;
    }

    static _formatCustom(timestamp, pattern) {
        const date = new Date(timestamp);

        const replacements = {
            'YYYY': date.getFullYear(),
            'YY': String(date.getFullYear()).slice(-2),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'M': date.getMonth() + 1,
            'DD': String(date.getDate()).padStart(2, '0'),
            'D': date.getDate(),
            'HH': String(date.getHours()).padStart(2, '0'),
            'H': date.getHours(),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'm': date.getMinutes(),
            'ss': String(date.getSeconds()).padStart(2, '0'),
            's': date.getSeconds(),
            'SSS': String(date.getMilliseconds()).padStart(3, '0'),
            'A': date.getHours() >= 12 ? 'PM' : 'AM',
            'a': date.getHours() >= 12 ? 'pm' : 'am'
        };

        return pattern.replace(/YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s|SSS|A|a/g, match => replacements[match]);
    }

    static _defaultFormat(timestamp, options) {
        const date = new Date(timestamp);

        if (options.output === 'seconds') {
            return Math.floor(timestamp / 1000).toString();
        } else if (options.output === 'iso') {
            return date.toISOString();
        } else if (options.output === 'locale') {
            return date.toLocaleString(options.locale || 'es-ES');
        }

        return timestamp.toString();
    }
}