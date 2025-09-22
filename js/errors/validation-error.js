export class ValidationError extends Error {
    constructor(errors) {
        super('Validation failed');
        this.name = 'ValidationError';
        this.details = errors;
    }
}