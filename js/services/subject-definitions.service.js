import { Service } from './../lib/service.js';
import { SubjectsDefinitionContract } from './../contracts/subjects-definition.contract.js';

export class SubjectsDefinitionService extends Service {

    static baseEndpoint = '/SubjectsDefinition';
    static contract = new SubjectsDefinitionContract();

    static async list() {
        return await this.get('', null, null, 'default');
    }

    static async create(data) {
        return await this.post('', data, 'default');
    }

    static async update(subjectID, data) {
        return await this.put(`${subjectID}`, data, 'default');
    }

    static async delete(subjectID) {
        return await this.delete(`${subjectID}`);
    }
}
