import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const NotificationsContract = makeContract({
	schema: {
		notificationID: t.string({
			required: false
		}),
		userID: t.string({
			required: true
		}),
		title: t.string({
			required: true,
			min: 1,
			max: 120,
			trim: true
		}),
		body: t.string({
			required: true,
			min: 1,
			max: 2000,
			trim: true
		}),
		sentAt: t.date({
			required: false,
			coerce: true
		}),
		userName: t.string({
			required: false
		}),
	},
	scopes: {
		create: [
			'userID',
			'title',
			'body'
		],
		update: [
			'notificationID',
			'title',
			'body'
		],
		table: [
			'notificationID',
			'title',
			'userName',
			'sentAt'
		],
	},
});
