import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CareersContract } from './../contracts/careers.contract.js';

const ENDPOINT = '/Careers';

export const CareersService = {
    contract: CareersContract,

    async list() {
        const carrers = await fetchJSON(
            `${ENDPOINT}/getCareers`
        );
        const parsed = Array.isArray(carrers) ? carrers.map(n => CareersContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('Careers:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const carrers = await postJSON(
            `${ENDPOINT}/insertCareer`,
            CareersContract.parse(data, 'create')
        );
        const parsed = CareersContract.parse(carrers, 'table');
        document.dispatchEvent(new CustomEvent('Careers:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const carrers = await putJSON(
            `${ENDPOINT}/updateCareer/${data.id}`,
            CareersContract.parse(data, 'update')
        );
        const parsed = CareersContract.parse(carrers, 'table');
        document.dispatchEvent(new CustomEvent('Careers:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteCareer/${id}`
        );
        document.dispatchEvent(new CustomEvent('Careers:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};