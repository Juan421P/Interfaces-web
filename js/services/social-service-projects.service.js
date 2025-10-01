import { Service } from "../lib/service.js";
import { SocialServiceContract } from "../contracts/social-service-projects.contract";

export class SocialServiceService extends Service{

    constructor(){
        super('/SocialService', new SocialServiceContract());
    }

    async getAll(){
        return await this.getAll('getDataSocialService', null, 'table');
    }

    async create(socialServiceData){
        return await this.post('newSocialService', socialServiceData, 'create');
    }

    async update(socialServiceData){
        return await this.put('updateSocialService', socialServiceData, 'update');
    }

    async delete(id){
        return await this.delete('deleteSocialService', id);
    }
}