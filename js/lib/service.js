import { Network } from './network.js';

import { ServiceError } from './../errors/services/service-error.js';
import { ServiceNetworkError } from './../errors/services/service-network-error';
import { ServiceValidationError } from './../errors/services/service-validation-error';
import { ServiceEndpointError } from './../errors/services/service-endpoint-error';
import { ServiceResponseError } from './../errors/services/service-response-error';
import { ServiceAuthenticationError } from './../errors/services/service-authentication-error';

export class Service {

    static baseEndpoint = '';
    static contract = null;

    static async get(endpoint = '', data = null, requestScope = null, responseScope = null) {
        try {
            const fullPath = this._buildPath(endpoint, data?.id);

            const result = await Network.get({
                path: fullPath,
                includeCredentials: true
            });

            console.log(result);

            const parsed = this._parseResult(result, responseScope);
            this._dispatchEvent('get', parsed);
            return parsed;

        } catch (error) {
            throw this._wrapError(error, endpoint, 'GET');
        }
    }

    static async post(endpoint = '', data = null, requestScope = null, responseScope = null) {
        try {
            const fullPath = this._buildPath(endpoint);
            const body = this.contract && data ?
                this.contract.parse(data, requestScope) : data;

            const result = await Network.post({
                path: fullPath,
                body: body,
                includeCredentials: true
            });

            const parsed = this._parseResult(result, responseScope);
            this._dispatchEvent('post', parsed);
            return parsed;

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ServiceValidationError(this.name, endpoint, error.details, data);
            }
            throw this._wrapError(error, endpoint, 'POST');
        }
    }

    static async put(endpoint = '', data = null, requestScope = null, responseScope = null) {
        try {
            const fullPath = this._buildPath(endpoint, data?.id);
            const body = this.contract && data ?
                this.contract.parse(data, requestScope) : data;

            const result = await Network.put({
                path: fullPath,
                body: body,
                includeCredentials: true
            });

            const parsed = this._parseResult(result, responseScope);
            this._dispatchEvent('put', parsed);
            return parsed;

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ServiceValidationError(this.name, endpoint, error.details, data);
            }
            throw this._wrapError(error, endpoint, 'PUT');
        }
    }

    static async delete(endpoint = '', id = null, responseScope = null) {
        try {
            const fullPath = this._buildPath(endpoint, id);
            const result = await Network.delete({
                path: fullPath,
                includeCredentials: true
            });

            const parsed = this._parseResult(result, responseScope);
            this._dispatchEvent('delete', { id, result: parsed });
            return parsed;

        } catch (error) {
            throw this._wrapError(error, endpoint, 'DELETE');
        }
    }

    static async getRaw(endpoint = '', data = null) {
        try {
            const fullPath = this._buildPath(endpoint, data?.id);
            const result = await Network.get({
                path: fullPath,
                includeCredentials: true
            });

            this._dispatchEvent('get', result);
            return result;

        } catch (error) {
            throw this._wrapError(error, endpoint, 'GET');
        }
    }

    static async postRaw(endpoint = '', data = null, requestScope = null) {
        try {
            const fullPath = this._buildPath(endpoint);
            const body = this.contract && data ?
                this.contract.parse(data, requestScope) : data;

            const result = await Network.post({
                path: fullPath,
                body: body,
                includeCredentials: true
            });

            this._dispatchEvent('post', result);
            return result;

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ServiceValidationError(this.name, endpoint, error.details, data);
            }
            throw this._wrapError(error, endpoint, 'POST');
        }
    }

    static async putRaw(endpoint = '', data = null, requestScope = null) {
        try {
            const fullPath = this._buildPath(endpoint, data?.id);
            const body = this.contract && data ?
                this.contract.parse(data, requestScope) : data;

            const result = await Network.put({
                path: fullPath,
                body: body,
                includeCredentials: true
            });

            this._dispatchEvent('put', result);
            return result;

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ServiceValidationError(this.name, endpoint, error.details, data);
            }
            throw this._wrapError(error, endpoint, 'PUT');
        }
    }

    static async deleteRaw(endpoint = '', id = null) {
        try {
            const fullPath = this._buildPath(endpoint, id);
            const result = await Network.delete({
                path: fullPath,
                includeCredentials: true
            });

            this._dispatchEvent('delete', { id, result });
            return result;

        } catch (error) {
            throw this._wrapError(error, endpoint, 'DELETE');
        }
    }

    static _buildPath(endpoint, id = null) {
        let path = `${this.baseEndpoint}`;
        if (endpoint) path += `/${endpoint}`;
        if (id) path += `/${id}`;
        return path;
    }

    static _parseResult(result, scope) {
        if (!this.contract || !result) {
            return result;
        }

        try {
            if (Array.isArray(result)) {
                return result.map(item => this.contract.parse(item, scope));
            }
            return this.contract.parse(result, scope);
        } catch (error) {
            console.warn(`Contract parsing failed for ${this.name}, returning raw data:`, error);
            return result;
        }
    }

    static _dispatchEvent(action, data) {
        document.dispatchEvent(new CustomEvent(`${this.name}:${action}`, {
            detail: data
        }));
    }

    static _wrapError(error, endpoint, method) {
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