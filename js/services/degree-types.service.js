import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
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
};
