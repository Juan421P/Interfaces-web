import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const NotificationsContract = makeContract({
	schema: {
		id: t.int({ 
			required: false
		}),
		title: t.string({
			required: true,
			min: 1,
			max: 120, trim: true }),
		body: t.string({ required: true, min: 1, max: 2000, trim: true }),
		status: t.enum(['draft', 'published'], { default: 'draft' }),
		createdAt: t.date({ required: false, coerce: true }),
	},
	scopes: {
		create: ['title', 'body', 'status'],
		update: ['id', 'title', 'body', 'status'],
		table: ['id', 'title', 'status', 'createdAt'],
	},
});
