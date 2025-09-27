import { PipeParseError } from './pipe-parse-error';

export class TimestampPipeParseError extends PipeParseError {
    constructor(value, options = {}, originalError = null) {
        super('TimestampPipe', value, options, originalError);
        this.name = 'TimestampPipeParseError';
    }
}