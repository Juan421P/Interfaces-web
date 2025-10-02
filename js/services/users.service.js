// js/services/users.service.js
import { Service } from './../lib/service.js';
import { UsersContract } from './../contracts/users.contract.js';

export class UsersService extends Service {

  static baseEndpoint = '/Users';
  static contract = new UsersContract();

  // ——— estilo parecido a NotificationsService ———
  static async list() {
    // GET /Users  → scope de respuesta 'table' si tu contrato lo usa
    return await this.get('', null, null, 'table');
  }

  static async create(userData) {
    // POST /Users → scope de request 'create', respuesta 'detail'
    return await this.post('', userData, 'create', 'detail');
  }

  static async update(userData) {
    // PUT /Users/{id} → requiere userData.id
    return await this.put('', userData, 'update', 'detail');
  }

  static async delete(id) {
    // DELETE /Users/{id}
    return await super.delete('', id);
  }

  // ——— extras útiles y alias para tu UI ———
  static async getAll() {
    return await this.list();
  }

  static async getById(id) {
    // GET /Users/{id}
    return await this.get('', { id }, null, 'detail');
  }
}
