import { Interface } from './../base/interface.js';
import { AuthService } from '../../js/services/auth.service.js';
import { NotificationsService } from '../../js/services/notifications.service.js';

import {
    Modal,
    Toast,
    Button,
    Table,
    Form,
    FormInput,
    SubmitInput
} from './../../components/components.js';

export default class NotificationsInterface extends Interface {

    static getTemplate() {
        return `
<main class="flex flex-col min-h-screen p-10 mb-40 md:ml-80">
    <div class="flex items-center justify-between mb-10">
        <h1
            class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow select-none py-3">
            Notificaciones
        </h1>
        <div class="block bg-transparent group rounded-xl">
            <div id="add-notification-btn-container"></div>
        </div>
    </div>

    <template id="form-template">
        <form>
            <div id="notification-form-host" class="flex flex-col m-5 space-y-4">
                <div id="title-host"></div>
                <div id="body-host"></div>
                <div class="flex justify-start mt-4">
                    <div id="submit-host"></div>
                </div>
            </div>
        </form>
    </template>

    <template id="modal-form-template">
        <div id="modal-overlay" class="fixed inset-0 transition-opacity opacity-0 pointer-events-none">
        </div>
        <div id="modal-container"
            class="fixed inset-0 flex items-center justify-center transition-all scale-90 opacity-0">
            <div id="modal-content" class="w-full max-w-2xl p-6 rounded-xl">
                <div id="form-container"></div>
            </div>
            <button id="modal-close" class="absolute top-4 right-4">✕</button>
        </div>
    </template>

    <div id="notifications-table"></div>
</main>
        `;
    }

    async init() {
        // utils
        this.toast = new Toast();
        await this.toast.init();

        // usuario actual
        const auth = await AuthService.me();
        this.currentUser = auth?.user;

        if (!this.currentUser) {
            this.toast.show('Usuario no autenticado 😭');
            window.location.hash = '#login';
            return;
        }

        // botón para agregar (solo admin)
        if (this.currentUser.roleID === 'Administrador') {
            new Button({
                host: '#add-notification-btn-container',
                text: 'Agregar notificación',
                collapseText: true,
                buttonType: 1,
                onClick: () => this._openNotificationForm()
            });
        }

        await this._renderTable();
    }

    async _openNotificationForm() {
        const modal = new Modal({
            id: 'notification-form-modal',
            size: 'lg',
            renderMode: 'component',
            components: [
                {
                    type: Form,
                    opts: {
                        host: '#form-container',
                        templateId: 'form-template',
                        components: [
                            {
                                type: FormInput,
                                opts: {
                                    id: 'title',
                                    placeholder: 'Ingrese un título',
                                    type: 'text'
                                }
                            },
                            {
                                type: FormInput,
                                opts: {
                                    id: 'body',
                                    placeholder: 'Ingrese el mensaje',
                                    type: 'textarea',
                                    rows: 5
                                }
                            },
                            {
                                type: SubmitInput,
                                opts: {
                                    id: 'submit',
                                    text: 'Añadir',
                                    removeIcon: true,
                                    additionalClasses: 'text-sm px-4 py-2'
                                }
                            }
                        ],
                        onSubmit: async (values) => {
                            if (!this.currentUser) {
                                this.toast.show('Usuario no autenticado');
                                return;
                            }

                            const payload = {
                                userID: this.currentUser.userID ?? this.currentUser.userId ?? '',
                                userName: `${this.currentUser.personName ?? ''} ${this.currentUser.personLastName ?? ''}`.trim(),
                                title: String(values.title ?? ''),
                                body: String(values.body ?? ''),
                                sentAt: new Date().toISOString().slice(0, 10)
                            };

                            try {
                                await this.notificationsService.create(payload);
                                this.toast.show('Notificación creada ✅', 3000);
                                await this._renderTable();
                                modal.close();
                            } catch (err) {
                                console.error('Error creando notificación:', err);
                                this.toast.show('Error al crear notificación');
                            }
                        }
                    }
                }
            ]
        });
    }

    async _renderTable() {
        try {
            if (!this.table) {
                this.table = new Table({
                    host: '#notifications-table',
                    service: NotificationsService,
                    servicePrefix: 'Notifications',
                    headers: [
                        { label: "Título", key: "title" },
                        { label: "Mensaje", key: "body" },
                        { label: "Usuario", key: "userName" },
                        { label: "Enviado", key: "sentAt" }
                    ],
                    searchable: true,
                    paginated: true,
                    perPage: 10,
                    contextMenu: true,
                    contextMenuOpts: (row) => [
                        {
                            label: 'Ver',
                            onClick: () => this._openViewModal(row)
                        },
                        {
                            label: 'Eliminar',
                            className: 'text-red-600',
                            onClick: async () => {
                                try {
                                    await this.notificationsService.delete(row.notificationID);
                                    this.toast.show('Notificación eliminada 💔', 3000);
                                    await this._renderTable();
                                } catch (err) {
                                    console.error('Error eliminando notificación:', err);
                                    this.toast.show('Error al eliminar notificación');
                                }
                            }
                        }
                    ]
                });

                await this.table.render();
            }

            const items = await this.notificationsService.getAll();
            this.table.data = Array.isArray(items) ? items : (items?.data ?? []);
            if (typeof this.table._onDataLoaded === 'function') {
                await this.table._onDataLoaded();
            } else if (typeof this.table.reload === 'function') {
                await this.table.reload();
            }

        } catch (err) {
            console.error('Error cargando notificaciones:', err);
            this.toast.show('Error al cargar notificaciones');
        }
    }

    _openViewModal(row) {
        const container = document.createElement('div');
        container.className = 'max-w-2xl p-6';

        const title = document.createElement('h3');
        title.className = 'text-xl font-semibold mb-3 bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent';
        title.textContent = row.title ?? '—';

        const meta = document.createElement('p');
        meta.className = 'mb-4 text-sm text-indigo-500';
        meta.textContent = `${row.userName ?? '—'} • ${row.sentAt ?? '—'}`;

        const body = document.createElement('div');
        body.className = 'text-base text-[rgb(var(--text-from))]';
        body.textContent = row.body ?? '';

        container.appendChild(title);
        container.appendChild(meta);
        container.appendChild(body);

        new Modal({
            content: container,
            renderMode: 'component',
            size: 'md'
        });
    }
}
