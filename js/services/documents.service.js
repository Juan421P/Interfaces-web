import { Service } from "../lib/service.js";
import { DocumentsContract } from "../contracts/documents.contract.js";

export class DocumentsService extends Service{

    constructor(){
        super('/Documents', new DocumentsContract());
    }

    async getAll(){
        return await this.get('getDocuments', null, 'table');
    }

    async create(documentData){
        return await this.post('insertDocument', documentData, 'create');
    }

    async update(documentData){
        return await this.put('updateDocument', documentData, 'update');
    }

    async delete(id){
        return await this.delete('deleteDocument',id);
    }
}