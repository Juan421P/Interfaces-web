import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { CyclicStudentPerformanceContract } from './../contracts/cyclic-student-performances.contract.js';

const ENDPOINT = '/CyclicStudentPerformances';

export const CyclicStudentPerformanceService = {
    contract: CyclicStudentPerformanceContract,

    async list() {
        const performances = await fetchJSON(
            `${ENDPOINT}/getAllPerformances`
        );
        const parsed = Array.isArray(performances) ? performances.map(p => CyclicStudentPerformanceContract.parse(p, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CyclicStudentPerformances:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const performance = await postJSON(
            `${ENDPOINT}/createPerformance`,
            CyclicStudentPerformanceContract.parse(data, 'create')
        );
        const parsed = CyclicStudentPerformanceContract.parse(performance, 'table');
        document.dispatchEvent(new CustomEvent('CyclicStudentPerformances:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const performance = await putJSON(
            `${ENDPOINT}/${data.performanceID}`,
            CyclicStudentPerformanceContract.parse(data, 'update')
        );
        const parsed = CyclicStudentPerformanceContract.parse(performance, 'table');
        document.dispatchEvent(new CustomEvent('CyclicStudentPerformances:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deletePerformance/${id}`
        );
        document.dispatchEvent(new CustomEvent('CyclicStudentPerformances:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};
