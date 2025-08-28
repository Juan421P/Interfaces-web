import { fetchJSON, postJSON, putJSON, deleteJSON } from "./../lib/network.js";
import { FacultyLocalitiesContract } from "../contracts/faculty-localities.contract";

const ENDPOINT = '/FacultyLocalities';

export const FacultyLocalitiesService = {
    contract: FacultyLocalitiesContract,

    async list(){
        const facultyLocality = await fetchJSON(
            `${ENDPOINT}/GetAllFacultyLocalities` 
        );

        const parsed = Array.isArray(facultyLocality) ? facultyLocality.map(n => FacultyLocalitiesContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('facultyLocality:list', {
            detail:parsed
        }));
        return parsed;
    },

    async create(data){
        const facultyLocality = await postJSON(
            `${ENDPOINT}/AddFacultyLocality`,
            FacultyLocalitiesContract.parse(data, 'create')
        );
        const parsed = FacultyLocalitiesContract.parse(facultyLocality, 'table');
        document.dispatchEvent(new CustomEvent('facultyLocality:create', {
            detail:parsed
        }));
        return parsed;
    },

    async update(data){
        const facultyLocality = await putJSON(
            `${ENDPOINT}/${data.facultyLocalityID}`,
            FacultyLocalitiesContract.parse(data, 'update')
        );
        const parsed = FacultyLocalitiesContract.parse(facultyLocality, 'table');
        document.dispatchEvent(new CustomEvent('facultyLocality::update', {detail: parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/DeleteFacultyLocality/${id}`
        );
        document.dispatchEvent(new CustomEvent('facultyLocality:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};