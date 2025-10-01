import { Service } from "../lib/service.js";
import { StudentContract } from "../contracts/students.contract.js";

export class StudentService extends Service{
     
    constructor(){
        super('/Students', new StudentContract());
    }

    async getAll(){
        return await this.get('getStudents', null, 'table');
    }

    async create(studentData){
        return await this.post('newStudent', studentData, 'create');
    }

    async update(studentData){
        return await this.put('updateStudents', studentData, 'update');
    }

    async delete(id){
        return await this.delete('deleteStudents', id)
    }
}