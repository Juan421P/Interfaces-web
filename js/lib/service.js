import { Network } from './network.js';

import { ServiceError } from './../errors/services/service-error.js';
import { ServiceNetworkError } from './../errors/services/service-network-error';
import { ServiceValidationError } from './../errors/services/service-validation-error';
import { ServiceEndpointError } from './../errors/services/service-endpoint-error';
import { ServiceResponseError } from './../errors/services/service-response-error';
import { ServiceAuthenticationError } from './../errors/services/service-authentication-error';

export class Service {
    constructor(baseEndpoint, contract) {
        if (!baseEndpoint) {
            throw new ServiceError('Service', 'Service requires a base endpoint');
        }
        if (!contract) {
            throw new ServiceError('Service', 'Service requires a contract');
        }
        
        this.baseEndpoint = baseEndpoint;
        this.contract = contract;
        this.name = this.constructor.name.replace('Service', '');
    }

    async list(endpoint = `get${this.name}s`, scope = 'table') {
        try {
            const fullPath = `${this.baseEndpoint}/${endpoint}`;
            const data = await Network.get({
                path: fullPath,
                includeCredentials: true
            });
            
            const parsed = Array.isArray(data) ? data.map(item => this.contract.parse(item, scope)) : [];
            
            document.dispatchEvent(new CustomEvent(`${this.name}:list`, {
                detail: parsed
            }));
            
            return parsed;
            
        } catch (error) {
            throw this._wrapError(error, endpoint, 'GET');
        }
    }

    async create(data, endpoint = `new${this.name}`, scope = 'create') {
        try {
            const fullPath = `${this.baseEndpoint}/${endpoint}`;
            const validatedData = this.contract.parse(data, scope);
            
            const result = await Network.post({
                path: fullPath,
                body: validatedData,
                includeCredentials: true
            });
            
            const parsed = this.contract.parse(result, 'table');
            
            document.dispatchEvent(new CustomEvent(`${this.name}:create`, {
                detail: parsed
            }));
            
            return parsed;
            
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ServiceValidationError(this.name, endpoint, error.details, data);
            }
            throw this._wrapError(error, endpoint, 'POST');
        }
    }

    async update(data, endpoint = `update${this.name}`, scope = 'update') {
        try {
            const id = data[this.contract.getPrimaryKey()];
            if (!id) {
                throw new ServiceEndpointError(this.name, endpoint, 'PUT', 'Missing ID in data');
            }
            
            const fullEndpoint = endpoint.includes('{id}') 
                ? endpoint.replace('{id}', id)
                : `${endpoint}/${id}`;
                
            const fullPath = `${this.baseEndpoint}/${fullEndpoint}`;
            const validatedData = this.contract.parse(data, scope);
            
            const result = await Network.put({
                path: fullPath,
                body: validatedData,
                includeCredentials: true
            });
            
            const parsed = this.contract.parse(result, 'table');
            
            document.dispatchEvent(new CustomEvent(`${this.name}:update`, {
                detail: parsed
            }));
            
            return parsed;
            
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ServiceValidationError(this.name, endpoint, error.details, data);
            }
            throw this._wrapError(error, endpoint, 'PUT');
        }
    }

    async delete(id, endpoint = `delete${this.name}`) {
        try {
            if (!id) {
                throw new ServiceEndpointError(this.name, endpoint, 'DELETE', 'Missing ID parameter');
            }
            
            const fullEndpoint = endpoint.includes('{id}') 
                ? endpoint.replace('{id}', id)
                : `${endpoint}/${id}`;
                
            const fullPath = `${this.baseEndpoint}/${fullEndpoint}`;
            
            const result = await Network.delete({
                path: fullPath,
                includeCredentials: true
            });
            
            const success = result?.status === 'Proceso completado';
            
            document.dispatchEvent(new CustomEvent(`${this.name}:delete`, {
                detail: {
                    id,
                    success,
                    result
                }
            }));
            
            return success;
            
        } catch (error) {
            throw this._wrapError(error, endpoint, 'DELETE');
        }
    }

    async get(id, endpoint = `get${this.name}`, scope = 'table') {
        try {
            if (!id) {
                throw new ServiceEndpointError(this.name, endpoint, 'GET', 'Missing ID parameter');
            }
            
            const fullEndpoint = endpoint.includes('{id}') 
                ? endpoint.replace('{id}', id)
                : `${endpoint}/${id}`;
                
            const fullPath = `${this.baseEndpoint}/${fullEndpoint}`;
            
            const data = await Network.get({
                path: fullPath,
                includeCredentials: true
            });
            
            return this.contract.parse(data, scope);
            
        } catch (error) {
            throw this._wrapError(error, endpoint, 'GET');
        }
    }

    _wrapError(error, endpoint, method) {
        if (error instanceof ServiceError) {
            return error;
        }
        
        if (error.status === 401 || error.status === 403) {
            return new ServiceAuthenticationError(this.name, endpoint);
        }
        
        if (error.status) {
            return new ServiceNetworkError(
                this.name, 
                endpoint, 
                error.status, 
                error.message || 'Unknown error'
            );
        }
        
        return new ServiceError(
            this.name, 
            `Network request failed: ${error.message}`,
            { endpoint, method, originalError: error.message }
        );
    }
}