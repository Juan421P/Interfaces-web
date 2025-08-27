import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const AuthContract = makeContract({
	schema: {
		email: t.string({
			required: true,
			trim: true,
			regex: /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/,
		}),
		password: t.string({
			required: true,
			min: 8,
			max: 64,
			regex: /^[A-Za-z0-9#!@&]+$/,
		}),
	},
	scopes: {
		login: [
			'email',
			'password'
		]
	},
});