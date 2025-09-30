import { Interface } from './../base/interface.js';
import {
    Button,
    Checkbox
} from './../../components/components.js';
import { DeliveriesService } from './../../js/services/testing.service.js';

export default class TestingInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 mb-20 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Pruebas bellakitas
                    </h1>

                    <div class="flex items-center gap-3">
                        <input id="tracking-input" type="text"
                            class="w-full max-w-sm bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-sm placeholder:italic shadow-md border-none"
                            placeholder="Ingresar número de rastreo">

                        <div id="button-container" class="group"></div>
                    </div>
                </div>

                <div id="delivery-steps-container" class="relative flex flex-col gap-8 pb-36">
                    <div id="timeline-line" class="absolute w-1 rounded-full left-4 bg-gradient-to-r from-indigo-300 to-blue-300"></div>
                    <p id="message-text" class="text-sm font-medium text-center text-indigo-400">
                        Ingresa un número de rastreo para ver el estado de tu entrega.
                    </p>
                </div>
            </main>

            <template id="tmpl-delivery-summary">
                <div id="delivery-summary-card"
                    class="bg-gradient-to-bl from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] shadow-md rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <img id="delivery-status-avatar" src="" alt="Estado de la entrega"
                        class="flex-shrink-0 object-cover rounded-full w-14 h-14 bg-gradient-to-tr from-indigo-100 to-blue-100 drop-shadow">
                    <div class="flex-shrink-1">
                        <p id="delivery-title"
                            class="text-lg font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        </p>
                        <p id="delivery-sender"
                            class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        </p>
                        <span id="delivery-status"
                            class="block text-xs bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mt-1 drop-shadow select-none">
                        </span>
                    </div>
                    <div
                        class="sm:ml-auto text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none font-semibold text-right">
                        <p id="delivery-tracking-id">Cargando...</p>
                        <p id="delivery-estimated-delivery">Cargando...</p>
                        <p id="delivery-step-count">Cargando...</p>
                    </div>
                </div>
            </template>

            <template id="tmpl-delivery-step">
                <div id="delivery-step-card" class="relative pl-10 z-[50]">
                    <div class="absolute w-3 h-3 rounded-full shadow-md top-8 left-3"></div>
                    <div
                        class="bg-gradient-to-br from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                        <div class="flex items-start justify-between">
                            <div class="flex flex-col gap-2">
                                <div id="step-checkbox" class="flex items-center gap-2"></div>
                                <h2 id="step-description"
                                    class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                                </h2>
                                <p id="step-timestamp"
                                    class="text-xs bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-semibold">
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        `;
    }

    async init() {
        await this._setupTrackingSystem();
    }

    async _setupTrackingSystem() {
        const trackingInput = document.querySelector('#tracking-input');
        const container = document.querySelector('#delivery-steps-container');
        const messageText = document.querySelector('#message-text');

        new Button({
            host: '#button-container',
            text: 'Buscar',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /> <path d="M21 21l-6 -6" /> </svg>',
            onClick: async () => {
                const trackingID = trackingInput.value.trim().toUpperCase();
                if (!trackingID) {
                    messageText.textContent = 'Por favor, ingresa un número de rastreo.';
                    return;
                }

                const timelineLine = container.querySelector('#timeline-line');
                while (container.lastChild && container.lastChild !== timelineLine) {
                    container.removeChild(container.lastChild);
                }
                messageText.textContent = 'Buscando entrega...';

                const delivery = await DeliveriesService.getDetails(trackingID);

                if (delivery) {
                    this._renderDeliverySummary(delivery);
                    this._renderDeliverySteps(delivery);
                } else {
                    messageText.textContent = 'No se encontró una entrega con ese número.';
                }
            }
        });
    }

    _formatDate(dateString) {
        if (!dateString) return 'Pendiente';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    }

    _renderDeliverySummary(delivery) {
        const container = document.querySelector('#delivery-steps-container');
        const tpl = document.querySelector('#tmpl-delivery-summary').content.cloneNode(true);

        const titleElement = tpl.querySelector('#delivery-title');
        const senderElement = tpl.querySelector('#delivery-sender');
        const statusElement = tpl.querySelector('#delivery-status');
        const trackingIdElement = tpl.querySelector('#delivery-tracking-id');
        const estimatedDeliveryElement = tpl.querySelector('#delivery-estimated-delivery');
        const stepCountElement = tpl.querySelector('#delivery-step-count');
        const avatarElement = tpl.querySelector('#delivery-status-avatar');

        titleElement.textContent = delivery.title;
        senderElement.textContent = `Enviado por: ${delivery.sender}`;
        statusElement.textContent = `Estado: ${delivery.status}`;
        trackingIdElement.textContent = `Código: ${delivery.trackingID}`;
        estimatedDeliveryElement.textContent = `Entrega Estimada: ${delivery.estimatedDelivery}`;
        stepCountElement.textContent = `Pasos totales: ${delivery.steps.length}`;

        if (delivery.imgURL) {
            avatarElement.src = delivery.imgURL;
        } else {
            avatarElement.src = 'https://placehold.co/100x100/CCCCCC/000000?text=N/A';
        }

        container.insertBefore(tpl, container.querySelector('#timeline-line').nextSibling);
    }

    _renderDeliverySteps(delivery) {
        const container = document.querySelector('#delivery-steps-container');
        const messageText = container.querySelector('#message-text');

        if (messageText) {
            messageText.remove();
        }

        delivery.steps.forEach(step => {
            const tpl = document.querySelector('#tmpl-delivery-step').content.cloneNode(true);
            const checkboxHost = tpl.querySelector('#step-checkbox');
            const isCompleted = step.isCompleted;

            new Checkbox({
                host: checkboxHost,
                label: '',
                checked: isCompleted,
                data: { trackingID: delivery.trackingID, stepID: step.stepID },
                disabled: true,
                onChange: async (checked, data) => {
                    await DeliveriesService.updateStep(data.trackingID, data.stepID, checked);
                    const updatedDelivery = await DeliveriesService.getDetails(data.trackingID);
                    if (updatedDelivery) {
                        this._renderDeliverySteps(updatedDelivery);
                    }
                }
            });

            tpl.querySelector('#step-description').textContent = step.description;
            tpl.querySelector('#step-timestamp').textContent = this._formatDate(step.timestamp);

            const timelineDot = tpl.querySelector('.w-3.h-3.rounded-full');
            if (isCompleted) {
                timelineDot.classList.add('bg-green-500');
                timelineDot.classList.remove('bg-gradient-to-br', 'from-[rgb(var(--text-from))]', 'to-[rgb(var(--text-to))]');
            } else {
                timelineDot.classList.add('bg-red-400');
                timelineDot.classList.remove('bg-gradient-to-br', 'from-[rgb(var(--text-from))]', 'to-[rgb(var(--text-to))]');
            }

            container.appendChild(tpl);
        });

        this._updateTimelineHeight();
    }

    _updateTimelineHeight() {
        const container = document.querySelector('#delivery-steps-container');
        const cards = container.querySelectorAll('#delivery-step-card');
        const line = container.querySelector('#timeline-line');

        const dotCenterOffsetFromCardTop = 38;

        if (cards.length > 0 && line) {
            const firstCardTop = cards[0].offsetTop;
            const lastCard = cards[cards.length - 1];
            const lastCardTop = lastCard.offsetTop;

            const lineStartY = firstCardTop + dotCenterOffsetFromCardTop;
            const lineEndY = lastCardTop + dotCenterOffsetFromCardTop;

            line.style.top = `${lineStartY}px`;
            line.style.height = `${lineEndY - lineStartY + 100}px`;
        } else {
            if (line) {
                line.style.height = '0px';
                line.style.top = '0px';
            }
        }
    }
}