export class ContractScopeError extends Error {
    constructor(scope) {
        super(`Scope "${scope}" is not defined in contract`);
        this.name = 'ContractScopeError';
        this.scope = scope;
    }
}