import { PipeParseError } from './pipe-parse-error';

export class StringPipeParseError extends PipeParseError {
    constructor(value, options = {}, originalError = null) {
        super('StringPipe', value, options, originalError);
        this.name = 'StringPipeParseError';
    }
}