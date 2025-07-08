import { ROUTES } from './../../../js/helpers/routes.js';

const { Table } = await import(ROUTES.components.table.js);
let toast;

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    await loadTokens();
    await loadEntityTypes();

    document.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');

            const selected = btn.dataset.tab;

            document.querySelector('#token-table').classList.toggle('hidden', selected !== 'tokens');
            document.querySelector('#entity-type-table').classList.toggle('hidden', selected !== 'entities');
        });
    });

    document.querySelector('#manage-codes-btn').addEventListener('click', async () => {
        const { Modal } = await import(ROUTES.components.modal.js);
        const modal = new Modal({ templateId: 'tmpl-manage-codes', size: 'sm' });
        await modal.open();
    });
}

async function loadTokens() {
    const data = await listMockTokens();

    const table = new Table({
        host: '#token-table',
        headers: ['Clave', 'Descripción', ''],
        rows: data.map(t => [t.tokenKey, t.description, '']),
        headerClasses: 'px-4 py-2 font-bold text-indigo-400',
        rowClasses: 'text-indigo-700',
        columnClasses: ['', '', 'text-right'],
        paginated: false,
        searchable: false,
        sortable: false
    });

    await table.render();
}

async function loadEntityTypes() {
    const data = await listMockEntityTypes();

    const table = new Table({
        host: '#entity-type-table',
        headers: ['Tipo de entidad', '¿Código automático?', ''],
        rows: data.map(e => [
            e.entityType,
            e.isAutoCodeEnabled ? '✅' : '❌',
            ''
        ]),
        headerClasses: 'px-4 py-2 font-bold text-indigo-400',
        rowClasses: 'text-indigo-700',
        columnClasses: ['', '', 'text-right'],
        paginated: false,
        searchable: false,
        sortable: false
    });

    await table.render();
}

async function listMockTokens() {
    return Promise.resolve([
        { tokenKey: 'UNI', description: 'Universidad base' },
        { tokenKey: 'FAC', description: 'Facultad' },
        { tokenKey: 'DEP', description: 'Departamento académico' }
    ]);
}

async function listMockEntityTypes() {
    return Promise.resolve([
        { entityType: 'Estudiante', isAutoCodeEnabled: true },
        { entityType: 'Empleado', isAutoCodeEnabled: false },
        { entityType: 'Carrera', isAutoCodeEnabled: true }
    ]);
}
