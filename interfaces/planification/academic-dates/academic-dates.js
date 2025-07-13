import { ROUTES } from './../../../js/helpers/routes.js';
import { AcademicDatesService } from './../../../js/services/academic-dates.js';
import { EventTypesService } from './../../../js/services/event-types.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);

    const calendar = document.querySelector('#calendar');
    const currentMonthYear = document.querySelector('#current-month-year');
    const prevBtn = document.querySelector('#prev-month-btn');
    const nextBtn = document.querySelector('#next-month-btn');

    let currentDate = new Date();
    currentDate.setDate(1);

    const eventTypes = await EventTypesService.list();

    function formatMonthYear(date) {
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    }

    async function renderCalendar() {
        currentMonthYear.textContent = formatMonthYear(currentDate);

        while (calendar.children.length > 7) {
            calendar.removeChild(calendar.lastChild);
        }

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const firstDayWeek = new Date(year, month, 1).getDay();

        const datesThisMonth = await AcademicDatesService.listByMonth(year, month + 1);

        const datesMap = {};
        for (const d of datesThisMonth) {
            datesMap[d.date] = d;
        }

        for (let i = 0; i < 42; i++) {
            const cell = document.createElement('div');
            cell.className = 'h-20 min-w-[100px] border rounded-lg p-2 cursor-pointer select-none flex flex-col justify-center items-center';

            const dayNum = i - firstDayWeek + 1;
            if (dayNum > 0 && dayNum <= daysInMonth) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                cell.textContent = dayNum;

                if (datesMap[dateStr]) {
                    cell.classList.add('bg-gradient-to-r', 'from-indigo-400', 'to-blue-400', 'text-white', 'font-semibold');
                    const eventName = datesMap[dateStr].eventName || 'Evento';
                    const eventLabel = document.createElement('small');
                    eventLabel.textContent = eventName;
                    eventLabel.className = 'text-xs truncate max-w-full mt-1 select-text';
                    cell.appendChild(eventLabel);
                }

                cell.addEventListener('click', () => openDateModal(dateStr, datesMap[dateStr] || null));
            } else {
                cell.classList.add('bg-indigo-50', 'cursor-default');
            }

            calendar.appendChild(cell);
        }
    }

    async function openDateModal(dateStr, existingDate) {
        const modal = new Modal({ templateId: 'tmpl-academic-date-modal', size: 'md' });
        await modal.open();

        const form = modal.contentHost.querySelector('#academic-date-form');
        const modalTitle = modal.contentHost.querySelector('#modal-title');
        const dateInput = modal.contentHost.querySelector('#date');
        const eventTypeSelect = modal.contentHost.querySelector('#eventType');
        const eventNameInput = modal.contentHost.querySelector('#eventName');

        dateInput.value = dateStr;

        eventTypeSelect.innerHTML = `<option value="" disabled selected>Selecciona tipo de evento</option>`;
        eventTypes.forEach(et => {
            const option = document.createElement('option');
            option.value = et.eventTypeID;
            option.textContent = et.typeName;
            eventTypeSelect.appendChild(option);
        });

        if (existingDate) {
            modalTitle.textContent = 'Editar Fecha Académica';
            eventTypeSelect.value = existingDate.eventTypeID;
            eventNameInput.value = existingDate.eventName;
        } else {
            modalTitle.textContent = 'Añadir Fecha Académica';
            eventTypeSelect.value = '';
            eventNameInput.value = '';
        }

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        form.addEventListener('submit', async e => {
            e.preventDefault();

            const data = {
                date: dateInput.value,
                eventTypeID: eventTypeSelect.value,
                eventName: eventNameInput.value.trim()
            };

            if (!data.eventTypeID || !data.eventName) {
                alert('Por favor completa todos los campos');
                return;
            }

            try {
                if (existingDate) {
                    await AcademicDatesService.update(existingDate.id, data);
                    alert('Fecha académica actualizada');
                } else {
                    await AcademicDatesService.create(data);
                    alert('Fecha académica añadida');
                }
                modal.close();
                await renderCalendar();
            } catch {
                alert('Error al guardar la fecha académica');
            }
        }, { once: true });
    }

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    await renderCalendar();
}