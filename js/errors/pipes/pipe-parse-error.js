export class PipeParseError extends Error {
    constructor(pipeName, value, options = {}, originalError = null) {
        const displayValue = this._safeStringify(value);
        const displayOptions = this._safeStringify(options);

        const message = `Pipe "${pipeName}" failed to parse value ${displayValue} with options: ${displayOptions}`;
        super(message);
        this.name = 'PipeParseError';
        this.pipeName = pipeName;
        this.value = value;
        this.options = options;
        this.originalError = originalError;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PipeParseError);
        }
    }

    _safeStringify(obj) {
        try {
            if (typeof obj === 'string') return `"${obj}"`;
            if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';
            const str = JSON.stringify(obj);
            return str.length > 100 ? str.substring(0, 100) + '...' : str;
        } catch {
            return '[Complex Object]';
        }
    }
}