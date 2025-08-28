import { deleteJSON, fetchJSON, postJSON, putJSON } from './../lib/network.js'
import { FacultyCorrelativeContract } from '../contracts/faculty-correlatives.contract'

const ENDPOINT = '/FacultyCorrelative';

export const FacultyCorrelativeService = {
    contract: FacultyCorrelativeContract,

    async list(){
        const facultyCorrelative = await fetchJSON(
            `${ENDPOINT}/getFacultyCorrelatives` 
        );

        const parsed = Array.isArray(facultyCorrelative) ? facultyCorrelative.map(n => FacultyLocalitiesContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('FacultyCorrelatives:list', {
            detail:parsed
        }));
        return parsed;
    },

    async create(data){
        const facultyCorrelative = await postJSON(
            `${ENDPOINT}/newFacultyCorrelatives`,
            FacultyLocalitiesContract.parse(data, 'create')
        );
        const parsed = FacultyLocalitiesContract.parse(facultyCorrelative, 'table');
        document.dispatchEvent(new CustomEvent('facultyCorrelative:create', {
            detail:parsed
        }));
        return parsed;
    },

    async update(data){
        const facultyCorrelative = await putJSON(
            `${ENDPOINT}/${data.facultyCorrelativeID}`,
            FacultyCorrelativeContract.parse(data, 'update')
        );
        const parsed = FacultyLocalitiesContract.parse(facultyCorrelative, 'table');
        document.dispatchEvent(new CustomEvent('FacultyCorrelative::update', {detail: parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/deleteFacultyCorrelatives/${id}`
        );
        document.dispatchEvent(new CustomEvent('facultyCorrelative:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};