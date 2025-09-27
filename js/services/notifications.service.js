import { Service } from './../lib/service.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

export class NotificationsService extends Service {
    
    constructor() {
        super('/Notifications', new NotificationsContract());
    }

    async list() {
        return super.list('getNotifications', 'table');
    }

    async create(data) {
        return super.create(data, 'newNotification', 'create');
    }

    async update(data) {
        return super.update(data, 'updateNotification/{id}', 'update');
    }

    async delete(id) {
        return super.delete(id, 'deleteNotification/{id}');
    }

}