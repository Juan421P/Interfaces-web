import { ROUTES } from './../../../js/lib/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);
const { Calendar } = await import(ROUTES.components.calendar.js)

const eventsMock = [
	{ date: '2025-07-20', name: 'Inicio de clases' },
	{ date: '2025-07-25', name: 'Entrega de proyectos' }
];

const calendar = new Calendar({
	host: document.querySelector('#academic-calendar'),
	events: eventsMock,
	onAdd: day => {
		console.log(
			'[Calendar] Add event for', day
		);
	},
	onEdit: (day, event) => {
		console.log(
			'[Calendar] Edit', event,
			'on', day
		);
	},
	onDelete: (day, event) => {
		console.log(
			'[Calendar] Delete', event,
			'on', day
		);
	},
});

await calendar.load();