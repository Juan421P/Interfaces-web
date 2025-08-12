import { ROUTES } from './../../../js/helpers/routes.js';
import { CareersService } from './../../../js/services/careers.js';
import { StudentCareerEnrollmentsService } from './../../../js/services/student-career-enrollments.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Button } = await import(ROUTES.components.button.js);
const { Select } = await import(ROUTES.components.select.js);
const { FormInput } = await import(ROUTES.components.formInput.js);

export async function init() {
    const careers = await CareersService.list();
    const studentCareerEnrollments = await StudentCareerEnrollmentsService.list();

    new Select({
        host: '#career-select-container',
        data: careers,
        tableOrigin: true,
        idField: 'careerID',
        labelField: 'careerName',
        label: 'Filtrar por carreras',
        placeholder: 'Todas',
        name: 'filter-career',
        onChange: (value, text) => console.log('Selected:', value, text)
    });

    new Select({
        host: '#status-select-container',
        data: [...new Set(studentCareerEnrollments.map(sce => sce.status))],
        tableOrigin: false,
        idField: 'careerID',
        labelField: 'careerName',
        label: 'Filtrar por estado',
        placeholder: 'Todos',
        name: 'filter-status',
        onChange: (value, text) => console.log('Selected:', value, text)
    });

    new FormInput({
        host: '#search-input-container',
        placeholder: 'Buscar',
        label: 'Buscar',
        validationMethod: 'simpleText'
    });

    new Button({
        host: '#button-host',
        text: 'Buscar',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-current fill-none w-6 h-6"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>'
    });
}

async function openDetail(en) {
    const tpl = document.querySelector('#tmpl-career-enrollment-detail').content.cloneNode(true);

    tpl.querySelector('#detail-student').textContent = en.studentName;
    tpl.querySelector('#detail-career-info').textContent = `${en.careerName} • ${en.studentCode}`;
    tpl.querySelector('#detail-status').textContent = en.status;
    tpl.querySelector('#detail-start-date').textContent = en.startDate;
    tpl.querySelector('#detail-status-date').textContent = en.statusDate;

    const wrapper = document.createElement('div');
    wrapper.appendChild(tpl);

    const modal = new Modal({ size: 'md', content: wrapper.innerHTML });
    await modal.open();
}
