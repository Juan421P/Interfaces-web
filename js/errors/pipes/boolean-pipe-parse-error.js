import { PipeParseError } from './pipe-parse-error';

export class BooleanPipeParseError extends PipeParseError {
    constructor(value, options = {}, originalError = null) {
        super('BooleanPipe', value, options, originalError);
        this.name = 'BooleanPipeParseError';
    }
}