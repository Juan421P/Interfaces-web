import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { EvaluationPlansContract } from './../contracts/evaluationPlans.contract.js';

const ENDPOINT = '/EvaluationPlans';

export const EvaluationPlansService = {
    contract: EvaluationPlansContract,

    async list() {
        const response = await fetchJSON(
            `${ENDPOINT}/getEvaluationPlans`
        );
        const parsed = Array.isArray(response) ? response.map(r => EvaluationPlansContract.parse(r, 'table')) : [];
        document.dispatchEvent(new CustomEvent('EvaluationPlans:list', { 
            detail: parsed 
        }));
        return parsed;
    },

    async create(data) {
        const response = await postJSON(
            `${ENDPOINT}/newEvaluationPlan`,
            EvaluationPlansContract.parse(data, 'create')
        );
        const parsed = EvaluationPlansContract.parse(response, 'table');
        document.dispatchEvent(new CustomEvent('EvaluationPlans:create', { 
            detail: parsed 
        }));
        return parsed;
    },

    async update(data) {
        const response = await putJSON(
            `${ENDPOINT}/${data.evaluationPlanID}`,
            EvaluationPlansContract.parse(data, 'update')
        );
        const parsed = EvaluationPlansContract.parse(response, 'table');
        document.dispatchEvent(new CustomEvent('EvaluationPlans:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteEvaluationPlan/${id}`
        );
        document.dispatchEvent(new CustomEvent('EvaluationPlans:delete', {
            detail: { 
                id, 
                success 
            }
        }));
        return success === true;
    }
};