import { Service } from "../lib/service.js";
import { EvaluationInstrumentsContract } from "../contracts/evaluation-instruments.contract.js";

export class EvaluationInstrumentsService extends Service{

    constructor(){
        super('/EvaluationInstrument', new EvaluationInstrumentsContract());
    }

    async getAll(){
        return await this.get('getEvaluationInstruments', null, 'table');
    }

    async create(evaluationInstrumentData){
        return await this.post('insertEvaluationInstrument',evaluationInstrumentData,'create');
    }

    async update(evaluationInstrumentData){
        return await this.put('updateEvaluationInstrument', evaluationInstrumentData, 'update');
    }

    async delete(id){
        return await this.delete('deleteEvaluationInstrument', id);
    }
}
