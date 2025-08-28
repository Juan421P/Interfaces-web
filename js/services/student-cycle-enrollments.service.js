import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { studentCycleEnrollentsContract } from '../contracts/student-cycle-enrollments.contract.js';

const ENDPOINT = '/studentCycleEnrollments';

export const studentCycleEnrollmentsService ={
    contract: studentCycleEnrollentsContract,
    
    async list(){
        const studentCycleEnrollents = await fetchJSON(
            `${ENDPOINT}/getStudentCycleEnrollents`
        )
        const parsed = Array.isArray(studentCycleEnrollents) ? studentCycleEnrollents.map(n => studentCycleEnrollents.parse(n, 'table')) : [];
                document.dispatchEvent(new CustomEvent('studentCycleEnrollents:list', {
                    detail: parsed
                }));
                return parsed;
    },

    async create(data){
         const studentCycleEnrollents = await postJSON(
                    `${ENDPOINT}/newStudentCycleEnrollment`,
                    studentCycleEnrollents.parse(data, 'create')
                );
                const parsed = studentCycleEnrollents.parse(studentCycleEnrollents, 'table');
                document.dispatchEvent(new CustomEvent('studentCycleEnrollents:create', {
                    detail: parsed
                }));
                return parsed;
    },

     async update(data) {
            const studentCycleEnrollents = await putJSON(
                `${ENDPOINT}/${data.studentCycleEnrollents}`,
                studentCycleEnrollents.parse(data, 'update')
            );
            const parsed = studentCycleEnrollents.parse(s, 'table');
            document.dispatchEvent(new CustomEvent('studentCycleEnrollents:update', { detail: parsed }));
            return parsed;
        },

        async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteStudentCycleEnrollent/${id}`
        );
        document.dispatchEvent(new CustomEvent('studentCycleEnrollents:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}