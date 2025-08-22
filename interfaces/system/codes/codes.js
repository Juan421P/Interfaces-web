import { ROUTES } from './../../../js/lib/routes.js';
import { CodePatternsService } from './../../../js/services/code-patterns.js';
import { CodeGeneratorsService } from './../../../js/services/code-generators.js';
import { SubjectFamilyAllocationsService } from './../../../js/services/subject-family-allocations.js';
import { CodeSequencesService } from './../../../js/services/code-sequences.js';
import { CodeGenerationLogService } from './../../../js/services/code-generation-log.js';
import { EntityTypesService } from './../../../js/services/entity-types.js';
import { innerJOIN } from './../../../js/lib/index.js';

const { Table } = await import(ROUTES.components.table.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Button } = await import(ROUTES.components.button.js);
const { TabBar } = await import(ROUTES.components.tabBar.js);
const { Form } = await import(ROUTES.components.form.js);
const { Modal } = await import(ROUTES.components.modal.js);
const { Cards } = await import(ROUTES.components.cards.js);

const toast = new Toast();
await toast.init();

export async function init() {

    new Button({
        host: '#manage-codes-btn-container',
        text: 'Agregar código',
        onClick: async () => {
            new Modal({ templateId: 'tmpl-manage-codes', size: 'sm' });
        }
    });

    new TabBar({
        host: '#tabs',
        tabs: [
            { id: 'patterns', label: 'Patrones de generación', targetSelector: '#pattern-list' },
            { id: 'generators', label: 'Generadores', targetSelector: '#generator-list' },
            { id: 'allocations', label: 'Asignaciones', targetSelector: '#allocation-list' },
            { id: 'sequences', label: 'Secuencias', targetSelector: '#sequence-list' },
            { id: 'log', label: 'Historial', targetSelector: '#log' }
        ],
        activeId: 'patterns'
    });

    async function render() {
        const [patterns, generators, entityTypes] = await Promise.all([
            CodePatternsService.list(),
            CodeGeneratorsService.list(),
            EntityTypesService.list()
        ]);

        const enrichedPatterns = innerJOIN(patterns, [{
            data: entityTypes,
            foreignKey: 'entityTypeID',
            referenceKey: 'entityTypeID',
            alias: 'entityTypeData',
            fields: ['entityType']
        }]).map(p => ({
            entity: p.entityTypeData?.entityType || `Tipo ${p.entityTypeID}`,
            template: p.patternTemplate,
            detail: p.detail
        }));

        const enrichedGenerators = innerJOIN(generators, [{
            data: entityTypes,
            foreignKey: 'entityTypeID',
            referenceKey: 'entityTypeID',
            alias: 'entityTypeData',
            fields: ['entityType']
        }]).map(g => ({
            entity: g.entityTypeData?.entityType || `Tipo ${g.entityTypeID}`,
            template: g.generatorTemplate,
            detail: g.detail
        }));

        new Cards({
            host: '#pattern-list',
            templateId: '#tmpl-pattern-card',
            data: enrichedPatterns,
            bindings: [
                {
                    selector: '[data-field="entity"]',
                    key: 'entity'
                },
                {
                    selector: '[data-field="template"]',
                    key: 'template'
                },
                {
                    selector: '[data-field="detail"]',
                    key: 'detail'
                }
            ],
            contextMenu: {
                enable: true,
                pos: 'auto',
                actions: (item) => [
                    {
                        label: 'Ver',
                        onClick: () => {
                            toast.show('Ver xd');
                        }
                    },
                    {
                        label: 'Editar',
                        onClick: () => {
                            toast.show('Editar xd');
                        }
                    },
                    {
                        label: 'Eliminar',
                        onClick: () => {
                            toast.show('Eliminar xd');
                        }
                    }
                ]
            }
        });

        new Cards({
            host: '#generator-list',
            templateId: '#tmpl-generator-card',
            data: enrichedGenerators,
            bindings: [
                { selector: '[data-field="entity"]', key: 'entity' },
                { selector: '[data-field="template"]', key: 'template' },
                { selector: '[data-field="detail"]', key: 'detail' }
            ],
            contextMenu: { enable: true }
        });
    }

    await render();

}