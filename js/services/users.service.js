// js/services/users.service.js
import { Service } from '../lib/service.js';
import { UserContract } from '../contracts/user.contract.js';

export class UsersService extends Service {
  // 👉 El Service base usa estas propiedades estáticas
  static baseEndpoint = '/Users';         // ajusta si tu endpoint es otro
  static contract = new UserContract();   // el contrato vive aquí (no en la UI)

  // ===== Métodos de instancia para que funcionen con "new UsersService()" =====

  async getAll() {
    // Usa el GET del Service base con el "this" de UsersService (tiene baseEndpoint/contract)
    return await UsersService.get('', null, null, 'list'); // responseScope 'list' si tu contrato lo usa
  }

  async getById(id) {
    return await UsersService.get('', { id }, null, 'detail');
  }

  async create(data) {
    // El Service.post aplicará el contract.parse con scope 'create'
    return await UsersService.post('', data, 'create', 'detail');
  }

  async update(data) {
    // Requiere que "data.id" venga en el payload (tu UI ya lo envía)
    return await UsersService.put('', data, 'update', 'detail');
  }

  async delete(id) {
    // Llamamos al delete ESTÁTICO del Service, enlazando "this" a UsersService
    return await Service.delete.call(UsersService, '', id);
  }
}
