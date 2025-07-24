import { ROUTES } from './../../../js/helpers/routes.js';
import { showImageModal } from './../../../js/helpers/common-methods.js';
const { Modal } = await import(ROUTES.components.modal.js);

let toast;
let data = null;

const mockUniversity = {
    universityName: 'Universidad La Poderosa',
    rector: 'Ing. Abel Joyar',
    webPage: 'https://www.lapodeuni.edu.sv',
    logoUrl: 'https://i.imgur.com/wBugA4U.png'
};

const mockFaculties = ['Facultad de Ingeniería', 'Facultad de Ciencias Sociales', 'Facultad de Medicina', 'Facultad de Joseo'];
const mockLocalities = [{ name: 'San Salvador', isMain: true }, { name: 'Santa Ana', isMain: false }, { name: 'San Miguel', isMain: false }];

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();
    await loadUniversity();
    attachSectionCollapses();
    document.querySelector('#edit-university-btn')?.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-edit-university', size: 'sm' });
        await modal.open();
        fillEditForm();
        document.querySelector('#edit-university-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            data = {
                universityName: form.universityName.value,
                rector: form.universityRector.value,
                webPage: form.universityWeb.value,
                logoUrl: form.universityLogo.value
            };
            updateView();
            updateFaculties();
            updateLocalities();
            modal.close();
            toast.show('Cambios guardados', 3000);
        });
    });

    document.querySelector('#university-logo')?.addEventListener('click', () => {
        const src = document.querySelector('#university-logo').src;
        if (src) showImageModal(src);
    });
}

function attachSectionCollapses(root = document) {
    root.querySelectorAll('[data-toggle="collapse-sub"]').forEach(btn => {
        const target = document.querySelector(btn.dataset.target);
        if (!target) return;
        btn.addEventListener('click', () => {
            const isHidden = target.classList.toggle('hidden');
            const arrow = btn.querySelector('svg');
            if (arrow) arrow.classList.toggle('rotate-180', !isHidden);
        });
    });
}

function fillEditForm() {
    const form = document.querySelector('#edit-university-form');
    form.querySelector('#university-name-mdl').value = data.universityName || '';
    form.querySelector('#university-rector-mdl').value = data.rector || '';
    form.querySelector('#university-web-mdl').value = data.webPage || '';
    form.querySelector('#university-logo-mdl').value = data.logoUrl || '';
}

async function loadUniversity() {
    data = await Promise.resolve(mockUniversity);
    updateView();
    updateFaculties();
    updateLocalities();
}

function updateView() {
    document.querySelector('#university-name').textContent = data.universityName || '—';
    document.querySelector('#university-rector').textContent = `Rector: ${data.rector}` || '—';
    const web = document.querySelector('#university-web');
    web.textContent = data.webPage || '—';
    web.href = data.webPage || '#';
    document.querySelector('#university-logo').src = data.logoUrl || '';
}

function updateFaculties() {
    const list = document.querySelector('#faculties-list');
    const count = document.querySelector('#faculty-count');
    count.textContent = mockFaculties.length;
    list.innerHTML = '';
    mockFaculties.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.className = 'bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent select-none drop-shadow';
        list.appendChild(li);
    });
}

function updateLocalities() {
    const countEl = document.querySelector('#locality-count');
    const sedeEl = document.querySelector('#main-locality');
    countEl.textContent = mockLocalities.length;
    const main = mockLocalities.find(l => l.isMain);
    sedeEl.textContent = main ? main.name : '—';
}
