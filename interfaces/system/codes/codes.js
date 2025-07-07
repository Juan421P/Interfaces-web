import { ROUTES } from './../../../js/helpers/routes.js';

const { Table } = await import(ROUTES.components.table.js);
let toast;

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    await loadTokens();
    await loadEntityTypes();
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
