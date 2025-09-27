import { PipeParseError } from './pipe-parse-error';

export class DatePipeParseError extends PipeParseError {
    constructor(value, options = {}, originalError = null) {
        super('DatePipe', value, options, originalError);
        this.name = 'DatePipeParseError';
    }
}