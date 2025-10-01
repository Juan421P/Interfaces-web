/*import { Service } from "./../lib/service.js";
import { DegreeTypeContract } from "../contracts/degree-types.contract.js";

export class DegreeTypeService extends Service {

	constructor() {
        super('/DegreeTypes', new DegreeTypeContract());
    }

	async getAll() {
        return await this.get('getAllDegreeTypes', null, 'table');
    }

	async create(degreeTypeData) {
        return await this.post('AddDegreeType', degreeTypeData, 'create');
    }

	async update(degreeTypeData) {
        return await this.put('UpdateDegreeType', degreeTypeData, 'update');
    }

	async delete(id) {
        return await this.delete('DeleteDegreeType', id);
    }
}

/*import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { DegreeTypesContract } from './../contracts/degreeTypes.contract.js';

const ENDPOINT = '/DegreeTypes';

export const DegreeTypesService = {
	contract: DegreeTypesContract,

	async list() {
		const degreeTypes = await fetchJSON(
			`${ENDPOINT}/getAllDegreeTypes`
		);
		const parsed = Array.isArray(degreeTypes) ? degreeTypes.map(d => DegreeTypesContract.parse(d, 'table')) : [];
		document.dispatchEvent(new CustomEvent('DegreeTypes:list', {
			detail: parsed
		}));
		return parsed;
	},

	async create(data) {
		const degreeType = await postJSON(
			`${ENDPOINT}/AddDegreeType`,
			DegreeTypesContract.parse(data, 'create')
		);
		const parsed = DegreeTypesContract.parse(degreeType, 'table');
		document.dispatchEvent(new CustomEvent('DegreeTypes:create', {
			detail: parsed
		}));
		return parsed;
	},

	async update(data) {
		const degreeType = await putJSON(
			`${ENDPOINT}/${data.id}`,
			DegreeTypesContract.parse(data, 'update')
		);
		const parsed = DegreeTypesContract.parse(degreeType, 'table');
		document.dispatchEvent(new CustomEvent('DegreeTypes:update', { detail: parsed }));
		return parsed;
	},

	async delete(id) {
		const success = await deleteJSON(
			`${ENDPOINT}/DeleteDegreeType/${id}`
		);
		document.dispatchEvent(new CustomEvent('DegreeTypes:delete', {
			detail: {
				id,
				success
			}
		}));
		return success === true;
	}
};*/
