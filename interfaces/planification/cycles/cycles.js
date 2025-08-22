import { ROUTES } from './../../../js/lib/routes.js';
import { CyclesService } from './../../../js/services/cycles.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);

    const listContainer = document.querySelector('#cycles-list');
    const addBtn = document.querySelector('#add-cycle-btn');

    const cycles = await CyclesService.list();
    renderCycles(cycles);

    function renderCycles(cycles) {
        listContainer.innerHTML = '';
        cycles.forEach(c => {
            const tpl = document.querySelector('#tmpl-cycle-card').content.cloneNode(true);

            tpl.querySelector('#cycle-label').textContent = c.cycleLabel;
            tpl.querySelector('#cycle-year').textContent = c.year;
            tpl.querySelector('#cycle-start').textContent = c.startDate;
            tpl.querySelector('#cycle-end').textContent = c.endDate;

            listContainer.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-cycle', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#cycle-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;

            const data = {
                cycleLabel: form.label.value.trim(),
                year: parseInt(form.year.value),
                startDate: form.startDate.value,
                endDate: form.endDate.value
            };

            if (!data.cycleLabel || !data.year || !data.startDate || !data.endDate) {
                alert('Por favor completa los campos obligatorios');
                return;
            }

            try {
                await CyclesService.create(data);
                alert('Ciclo agregado correctamente');
                modal.close();
                const updated = await CyclesService.list();
                renderCycles(updated);
            } catch {
                alert('Error al agregar ciclo');
            }
        });
    });
}
