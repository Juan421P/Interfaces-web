import { ROUTES } from './../../js/lib/routes.js';
import { DeliveriesService } from './../../js/services/testing.js';
const { Button } = await import(ROUTES.components.button.js);
const { Checkbox } = await import(ROUTES.components.checkbox.js);

export async function init() {
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
                renderDeliverySummary(delivery);
                renderDeliverySteps(delivery);
            } else {
                messageText.textContent = 'No se encontró una entrega con ese número.';
            }
        }
    });
}

function _formatDate(dateString) {
    if (!dateString) return 'Pendiente';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
}

function renderDeliverySummary(delivery) {
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

function renderDeliverySteps(delivery) {
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
                    renderDeliverySteps(updatedDelivery);
                }
            }
        });

        tpl.querySelector('#step-description').textContent = step.description;
        tpl.querySelector('#step-timestamp').textContent = _formatDate(step.timestamp);

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

    updateTimelineHeight();
}

function updateTimelineHeight() {
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
        line.style.height = `${lineEndY - lineStartY + 100}px`; // Exact adjustment as requested
    } else {
        if (line) {
            line.style.height = '0px';
            line.style.top = '0px';
        }
    }
}