import { ROUTES } from './../../../js/helpers/routes.js';
import { CodePatternsService } from './../../../js/services/code-patterns.js';
import { CodeGeneratorsService } from './../../../js/services/code-generators.js';
import { SubjectFamilyAllocationsService } from './../../../js/services/subject-family-allocations.js';
import { CodeSequencesService } from './../../../js/services/code-sequences.js';
import { CodeGenerationLogService } from './../../../js/services/code-generation-log.js';
import { EntityTypesService } from './../../../js/services/entity-types.js';
import { innerJOIN } from './../../../js/helpers/index.js';

const { Table } = await import(ROUTES.components.table.js);
const { Toast } = await import(ROUTES.components.toast.js);
const toast = new Toast();
await toast.init();
const { Button } = await import(ROUTES.components.button.js);
const { TabBar } = await import(ROUTES.components.tabBar.js);
const { Form } = await import(ROUTES.components.form.js);

export async function init() {

    new Button({
        host: '#manage-codes-btn-container',
        text: 'Agregar código',
        onClick: async () => {
            const { Modal } = await import(ROUTES.components.modal.js);
            const modal = new Modal({ templateId: 'tmpl-manage-codes', size: 'sm' });
            await modal.open();
        }
    });

    new TabBar({
        host: '#tabs',
        tabs: [
            { id: 'patterns', label: 'Patrones de generación', targetSelector: '#patterns-table' },
            { id: 'generators', label: 'Generadores', targetSelector: '#generators-table' },
            { id: 'allocations', label: 'Asignaciones', targetSelector: '#allocations-table' },
            { id: 'sequences', label: 'Secuencias', targetSelector: '#sequences-table' },
            { id: 'log', label: 'Historial', targetSelector: '#log-table' }
        ],
        activeId: 'patterns'
    });

    async function render() {
        const [patterns, entityTypes] = await Promise.all([
            CodePatternsService.list(),
            EntityTypesService.list()
        ]);

        const patternsWithTypes = innerJOIN(
            patterns,
            [
                {
                    data: entityTypes,
                    foreignKey: 'entityTypeID',
                    referenceKey: 'entityTypeID',
                    alias: 'entityTypeData',
                    fields: ['entityType']
                }
            ]
        );

        const patternList = document.querySelector('#pattern-list');
        patternList.innerHTML = '';

        patternsWithTypes.forEach(pattern => {
            const tpl = document.querySelector('#tmpl-pattern-card').content.cloneNode(true);
            tpl.querySelector('#pattern-entity').textContent = pattern.entityTypeData?.entityType || `Tipo ${pattern.entityTypeID}`;
            tpl.querySelector('#pattern-template').textContent = pattern.patternTemplate;
            tpl.querySelector('#pattern-detail').textContent = pattern.detail;
            patternList.appendChild(tpl);
        });
    }

    await render();

}