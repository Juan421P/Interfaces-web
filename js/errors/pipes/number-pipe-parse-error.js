import { PipeParseError } from './pipe-parse-error';

export class NumberPipeParseError extends PipeParseError {
    constructor(value, options = {}, originalError = null) {
        super('NumberPipe', value, options, originalError);
        this.name = 'NumberPipeParseError';
    }
}