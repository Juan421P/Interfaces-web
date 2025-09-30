import { Contract } from './../lib/contract.js';

export class NotificationsContract extends Contract {
	constructor() {
		super({
			schema: {
				notificationID: Contract.types.string({
					required: true,
					default: ''
				}),
				userID: Contract.types.string({
					required: true,
					default: ''
				}),
				title: Contract.types.string({
					required: true,
					min: 1,
					max: 50,
					trim: true,
					default: '',
					regex: /^[\w\s.,!?@#&-]+$/
				}),
				body: Contract.types.string({
					required: true,
					min: 1,
					max: 250,
					trim: true,
					default: '',
					regex: /^[\w\s.,!?@#&-]+$/
				}),
				sentAt: Contract.types.timestamp({
					required: true,
					default: () => new Date().toISOString(),
				}),
				userName: Contract.types.string({
					required: true,
					default: ''
				}),
			},
			scopes: {
				create: [
					'userID',
					'title',
					'body',
					'userName',
					'sentAt',
				],
				table: [
					'notificationID',
					'title',
					'body',
					'userName',
					'sentAt'
				],
				delete: [
					'notificationID'
				]
			}
		});
	}
}