import { Service } from "./../lib/service.js";
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
