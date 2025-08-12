import { UsersService } from '../../js/services/users.js';
import { AuditService } from './../../js/services/audit.js';
import { THEMES, buildInitials, showImageModal } from './../../js/helpers/index.js';
import { ROUTES } from './../../js/helpers/routes.js';

const { Button } = await import(ROUTES.components.button.js);
const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const toast = new Toast();
await toast.init();

export async function init() {
    THEMES.loadTheme();

    const userID = sessionStorage.getItem('userID');
    if (!userID) throw new Error('No user ID found');
    const user = await UsersService.get(userID);
    if (!user) {
        console.error('[Profile] No session user :(');
        return;
    }

    const person = {
        firstName: user.firstName,
        lastName: user.lastName,
        contactEmail: user.email
    };

    const role = { roleName: user.role };

    renderAvatar(user, person);
    renderUserInfo(person, user, role);
    await renderAuditLog(user.userID);

    renderThemeSwatches();

    new Button({
        host: '#customization-btn-host',
        text: 'Continuar',
        buttonType: 2,
        showIcon: false,
        onClick: async () => {
            const selectedPalette = document.querySelector('input[name="selected-theme"]:checked')?.value;
            const mode = document.querySelector('input[name="theme-mode"]:checked')?.value || 'light';

            if (!selectedPalette) {
                toast.show('Por favor selecciona un tema 🫡');
                return;
            }

            const modal = new Modal({
                templateId: 'theme-preview-template',
                size: 'md',
                components: [
                    {
                        type: Button,
                        opts: {
                            host: '#confirm-theme',
                            text: 'Aplicar',
                            buttonType: 2,
                            showIcon: false,
                            onClick: () => {
                                const applied = THEMES.setTheme(selectedPalette, mode, true);
                                if (applied) {
                                    toast.show('Tema aplicado ✨');
                                } else {
                                    toast.show('No se pudo aplicar el tema 😕');
                                }
                                modal.close();
                            }
                        }
                    }
                ]
            });

            requestAnimationFrame(() => {
                const preview = modal.rootQuery ? modal.rootQuery('#theme-preview-box') : document.getElementById('theme-preview-box');
                if (!preview) return;

                const p = THEMES.palettes.find(x => x.name === selectedPalette);
                if (!p) return;

                const colors = (mode === 'dark' && p.dark) ? p.dark : p.light;
                const fromRgb = colors.textFrom;
                const toRgb = colors.textTo;

                preview.style.background = `linear-gradient(90deg, rgb(${fromRgb}), rgb(${toRgb}))`;
                if (colors.buttonText) preview.style.color = `rgb(${colors.buttonText})`;

                preview.style.border = 'none';
            });

        }
    });

    document.querySelector('#profile-avatar-main')?.addEventListener('click', () => {
        const img = document.querySelector('#profile-avatar-main img');
        if (img?.src) showImageModal(img.src);
    });
}

function renderAvatar(user, person) {
    const host = document.querySelector('#profile-avatar-main');
    if (!host) return;
    host.innerHTML = '';

    if (user.image) {
        const img = document.createElement('img');
        img.src = user.image;
        img.className = 'object-cover rounded-full hover:cursor-pointer';
        img.onerror = () => host.appendChild(buildInitials((person.firstName?.[0] || '') + (person.lastName?.[0] || '')));
        host.appendChild(img);
    } else {
        host.appendChild(buildInitials((person.firstName?.[0] || '') + (person.lastName?.[0] || '')));
    }
}

function renderUserInfo(person, user, role) {
    const nameEl = document.querySelector('#profile-name');
    const roleEl = document.querySelector('#profile-role');
    const emailEl = document.querySelector('#profile-email');
    if (nameEl) nameEl.textContent = `${person.firstName} ${person.lastName}`;
    if (roleEl) roleEl.textContent = role.roleName || 'Rol desconocido';
    if (emailEl) emailEl.textContent = person.contactEmail || user.email;
}

async function renderAuditLog(userID) {
    const container = document.querySelector('#audit-log');
    if (!container) {
        console.error('[profile.js]', 'Container #audit-log not found :(');
        return;
    }
    container.innerHTML = '';

    const auditTemplate = document.querySelector('#tmpl-audit-card');
    if (!auditTemplate) {
        console.error('[profile.js]', 'Template #tmpl-audit-card not found :(');
        container.innerHTML = '<p class="text-red-500">Hubo un error cargando la plantilla #tmpl-audit-card</p>';
        return;
    }
    const templateHTML = auditTemplate.innerHTML;
    const audits = await AuditService.recent(userID, 5);

    audits.forEach(audit => {
        let renderedHTML = templateHTML;
        renderedHTML = renderedHTML.replaceAll('{{operationType}}', String(audit.operationType || 'N/A'));
        renderedHTML = renderedHTML.replaceAll('{{affectedTable}}', String(audit.affectedTable || 'N/A'));
        renderedHTML = renderedHTML.replaceAll('{{recordID}}', String(audit.recordID || 'N/A'));

        const formattedDate = audit.operationAt ? new Date(audit.operationAt).toLocaleString() : 'N/A';
        renderedHTML = renderedHTML.replaceAll('{{operationAt}}', formattedDate);

        const tempParser = document.createElement('template');
        tempParser.innerHTML = renderedHTML.trim();

        const card = tempParser.content.firstElementChild;
        if (card) container.appendChild(card.cloneNode(true));
    });
}

function renderThemeSwatches() {
    const container = document.getElementById('themes-list');
    if (!container) return;

    container.innerHTML = '';
    const current = THEMES.getCurrent();

    function updateSelectionOutlines() {
        const mode = document.querySelector('input[name="theme-mode"]:checked')?.value || 'light';
        container.querySelectorAll('.swatch-item').forEach(item => {
            const input = item.querySelector('input[type="radio"]');
            const visual = item.querySelector('.swatch-visual');
            const paletteName = input.value;
            const palette = THEMES.palettes.find(p => p.name === paletteName);
            if (!palette) return;

            const outlineRgb = (mode === 'dark' ? (palette.dark?.textFrom || palette.light.textFrom) : palette.light.textFrom);

            if (input.checked) {
                visual.style.boxShadow = `0 0 0 4px rgba(${outlineRgb}, 0.95)`;
                visual.style.transform = 'scale(1.06)';
            } else {
                visual.style.boxShadow = 'none';
                visual.style.transform = 'scale(1)';
            }
        });
    }

    THEMES.palettes.forEach(p => {
        const light = p.light;

        const label = document.createElement('label');
        label.className = 'inline-flex items-center justify-center mx-1 cursor-pointer swatch-item';
        label.setAttribute('title', p.name);

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'selected-theme';
        input.value = p.name;
        input.className = 'hidden';
        if (p.name === current.palette) input.checked = true;

        const visual = document.createElement('div');
        visual.className = 'w-10 h-10 transition-all duration-200 rounded-full swatch-visual';
        visual.style.background = `rgb(${light.placeholderFrom})`;
        visual.style.border = '2px solid transparent';
        visual.style.boxSizing = 'border-box';

        label.appendChild(input);
        label.appendChild(visual);
        container.appendChild(label);
    });

    updateSelectionOutlines();

    container.addEventListener('change', e => {
        if (!e.target) return;
        if (e.target.name === 'selected-theme') updateSelectionOutlines();
    });

    document.querySelectorAll('input[name="theme-mode"]').forEach(r => {
        r.addEventListener('change', () => updateSelectionOutlines());
    });

    container.addEventListener('click', () => updateSelectionOutlines());
}