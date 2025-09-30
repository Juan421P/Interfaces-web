import { Service } from './../lib/service.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

export class NotificationsService extends Service {
    
    constructor() {
        super('/Notifications', new NotificationsContract());
    }

    async getAll() {
        return await this.get('getNotifications', null, 'table');
    }

    async create(notificationData) {
        return await this.post('newNotification', notificationData, 'create');
    }

    //async update(notificationData) {
    //    return await this.put('updateNotification', notificationData, 'update');
    //}

    async delete(id) {
        return await this.delete('deleteNotification', id);
    }

}