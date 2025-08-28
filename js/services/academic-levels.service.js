import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { AcademicLevelsContract } from './../contracts/academic-levels.contract.js';

const ENDPOINT = '/AcademicLevels';

export const AcademicLevelsService = {
    contract: AcademicLevelsContract,

    async list() {
        const academicLevel = await fetchJSON(
            `${ENDPOINT}/getAcademicLevels`
        );
        const parsed = Array.isArray(academicLevel) ? academicLevel.map(n => AcademicLevelsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('AcademicLevels:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const academicLevel = await postJSON(
            `${ENDPOINT}/insertAcademicLevel`,
            AcademicLevelsContract.parse(data, 'create')
        );
        const parsed = AcademicLevelsContract.parse(academicLevel, 'table');
        document.dispatchEvent(new CustomEvent('AcademicLevels:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const academicLevel = await putJSON(
            `${ENDPOINT}/updateAcademicLevel/${data.academicLevelID}`,
            AcademicLevelsContract.parse(data, 'update')
        );
        const parsed = AcademicLevelsContract.parse(academicLevel, 'table');
        document.dispatchEvent(new CustomEvent('AcademicLevels:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteAcademicLevel/${id}`
        );
        document.dispatchEvent(new CustomEvent('AcademicLevels:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};