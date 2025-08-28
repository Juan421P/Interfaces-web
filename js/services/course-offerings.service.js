import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CourseOfferingsContract } from './../contracts/course-offerings.contract.js';

const ENDPOINT = '/CourseOfferings';

export const CourseOfferingsService = {
    contract: CourseOfferingsContract,

    async list() {
        const courseOfferings = await fetchJSON(
            `${ENDPOINT}/getAllCourseOfferings`
        );
        const parsed = Array.isArray(courseOfferings) ? courseOfferings.map(n => CourseOfferingsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CourseOfferings:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const courseOfferings = await postJSON(
            `${ENDPOINT}/insertCourseOffering`,
            CourseOfferingsContract.parse(data, 'create')
        );
        const parsed = CourseOfferingsContract.parse(courseOfferings, 'table');
        document.dispatchEvent(new CustomEvent('CourseOfferings:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const courseOfferings = await putJSON(
            `${ENDPOINT}/updateCourseOffering/${data.courseOfferingID}`,
            CourseOfferingsContract.parse(data, 'update')
        );
        const parsed = CourseOfferingsContract.parse(courseOfferings, 'table');
        document.dispatchEvent(new CustomEvent('CourseOfferings:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteCourseOffering/${id}`
        );
        document.dispatchEvent(new CustomEvent('CourseOfferings:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};