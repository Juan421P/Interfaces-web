import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CourseEnrollmentsContract } from './../contracts/course-enrollments.contract.js';

const ENDPOINT = '/CourseEnrollments';

export const CourseEnrollmentsService = {
    contract: CourseEnrollmentsContract,

    async list() {
        const courseEnrollments = await fetchJSON(
            `${ENDPOINT}/getCourseEnrollments`
        );
        const parsed = Array.isArray(CourseEnrollments) ? courseEnrollments.map(n => CourseEnrollmentsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CourseEnrollments:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const courseEnrollments = await postJSON(
            `${ENDPOINT}/insertCourseEnrollment`,
            CourseEnrollmentsContract.parse(data, 'create')
        );
        const parsed = CourseEnrollmentsContract.parse(courseEnrollments, 'table');
        document.dispatchEvent(new CustomEvent('CourseEnrollments:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const courseEnrollments = await putJSON(
            `${ENDPOINT}/updateCourseEnrollment/${data.id}`,
            CourseEnrollmentsContract.parse(data, 'update')
        );
        const parsed = CourseEnrollmentsContract.parse(courseEnrollments, 'table');
        document.dispatchEvent(new CustomEvent('CourseEnrollments:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteCourseEnrollment/${id}`
        );
        document.dispatchEvent(new CustomEvent('CourseEnrollments:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};