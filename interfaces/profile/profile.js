import { Interface } from './../base/interface.js';
import { AuthService } from './../../js/services/auth.service.js';
import { buildInitials, showImageModal } from './../../js/lib/common.js';
import { THEMES } from './../../js/lib/themes.js';
import { Button, Toast } from '../../components/components.js';

export default class ProfileInterface extends Interface {
  static getTemplate() {
    return `
    <main class="flex flex-col min-h-screen p-10 pb-56 space-y-8 md:ml-80">
    <div
        class="bg-gradient-to-bl from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] shadow-md rounded-xl p-6 flex items-center gap-6">
        <div id="profile-avatar-main"
            class="flex items-center justify-center flex-shrink-0 rounded-full w-14 h-14 bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] drop-shadow">
        </div>
        <div class="flex-shrink-1">
            <p id="profile-name"
                class="text-lg font-semibold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow select-none">
            </p>
            <p id="profile-role"
                class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
            </p>
            <span id="profile-email"
                class="block text-xs bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mt-1 drop-shadow select-none">
            </span>
        </div>
    </div>

    <section class="pb-20 mt-6">
        <div class="flex">
            <h2
                class="font-semibold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow select-none mb-4">
                Personalización
            </h2>
        </div>

        <div class="p-0.5 bg-gradient-to-tr from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] rounded-4xl">
            <div class="px-10 py-9 bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-[calc(2rem-0.125rem)]">

                <div class="pb-6 space-y-2">
                    <div class="flex">
                        <h2
                            class="font-semibold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow select-none">
                            Tema
                        </h2>
                    </div>
                    <div id="themes-list" class="flex gap-4 py-2"></div>
                </div>

                <div class="pb-6 space-y-2">
                    <div class="flex">
                        <h2
                            class="font-semibold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow select-none">
                            Modo
                        </h2>
                    </div>
                    <div class="flex gap-4 py-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="theme-mode" value="light" class="hidden peer" checked>
                            <span
                                class="px-4 py-2 font-semibold transition-all duration-300 bg-white border-2 border-transparent rounded-lg shadow-sm text-neutral-800 peer-checked:border-[rgb(var(--button-from))] hover:scale-105">
                                Claro
                            </span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="theme-mode" value="dark" class="hidden peer">
                            <span
                                class="px-4 py-2 font-semibold text-white transition-all duration-300 border-2 border-transparent rounded-lg shadow-sm bg-neutral-800 peer-checked:border-[rgb(var(--button-from))] hover:scale-105">
                                Oscuro
                            </span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end">
                    <div id="customization-btn-host"></div>
                </div>

            </div>
        </div>
    </section>
</main>

<template id="tmpl-image-preview">
    <div class="flex items-center justify-center min-h-[70vh] p-10">
        <img id="modal-image-preview" src="" class="rounded-xl max-h-[70vh] object-contain shadow-xl" />
    </div>
</template>

<template id="tmpl-audit-card">
    <div class="bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-lg shadow p-4">
        <div class="flex">
            <p
                class="text-sm bg-gradient-to-tr from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent">
                {{operationType}} en <span class="font-semibold">{{affectedTable}}</span></p>
        </div>
        <div class="flex">
            <p
                class="text-xs bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                Registro
                #{{recordID}} • {{operationAt}}</p>
        </div>
    </div>
</template>

<template id="theme-preview-template">
    <div class="p-6 space-y-6 text-center">
        <h2 class="text-lg font-semibold select-none">Vista previa de tema</h2>
        <div id="theme-preview-box"
             class="flex items-center justify-center w-full h-32 text-xl font-bold text-white shadow-inner rounded-xl">
            Vista previa
        </div>
        <div id="confirm-theme" class="flex justify-end"></div>
    </div>
</template>
    `;
  }

  mountIn(hostSel = '#main-view') {
    const host = typeof hostSel === 'string' ? document.querySelector(hostSel) : hostSel;
    if (!host) throw new Error('[ProfileInterface] Host no encontrado');
    host.innerHTML = ProfileInterface.getTemplate();
    this.root = host;
  }

  async init() {
    // UI helpers
    this.toast = new Toast();
    await this.toast.init();

    // Cargar usuario real desde /Auth/me
    const me = await AuthService.me();
    const user = me?.user;
    if (!user) {
      console.error('[ProfileInterface] No session user');
      return;
    }

    
    const person = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      contactEmail: user.email || user.contactEmail || '',
      role: user.roleID || 'Usuario'
    };

    this._renderAvatar(user, person);
    this._renderUserInfo(person, user, person.role);

    this._setInitialThemeMode();
    this._renderThemeSwatches();

    // Botón "Continuar" para aplicar tema
    new Button({
      host: '#customization-btn-host',
      text: 'Continuar',
      buttonType: 2,
      showIcon: false,
      onClick: () => this._applyTheme()
    });

    // Click para ampliar avatar si hay imagen
    const avatar = document.querySelector('#profile-avatar-main');
    avatar?.addEventListener('click', () => {
      const img = avatar.querySelector('img');
      if (img?.src) showImageModal(img.src);
    });
  }

  // ===== Render básico =====
  _renderAvatar(user, person) {
    const host = document.querySelector('#profile-avatar-main');
    if (!host) return;

    host.innerHTML = '';
    const initials = `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`.toUpperCase();

    if (user.image) {
      const img = document.createElement('img');
      img.src = user.image;
      img.className = 'object-cover rounded-full hover:cursor-pointer';
      img.onerror = () => host.appendChild(buildInitials(initials || '?'));
      host.appendChild(img);
    } else {
      host.appendChild(buildInitials(initials || '?'));
    }
  }

  _renderUserInfo(person, user, role) {
    const nameEl = document.querySelector('#profile-name');
    const roleEl = document.querySelector('#profile-role');
    const emailEl = document.querySelector('#profile-email');

    if (nameEl) nameEl.textContent = `${person.firstName} ${person.lastName}`.trim();
    if (roleEl) roleEl.textContent = role || 'Usuario';
    if (emailEl) emailEl.textContent = person.contactEmail || user.email || '';
  }

  // ===== Temas =====
  _setInitialThemeMode() {
    const current = THEMES.getCurrent();
    const r = document.querySelector(`input[name="theme-mode"][value="${current.mode}"]`);
    if (r) r.checked = true;
  }

  _renderThemeSwatches() {
    const container = document.getElementById('themes-list');
    if (!container) return;

    container.innerHTML = '';
    const current = THEMES.getCurrent();

    const updateSelection = () => {
      container.querySelectorAll('.swatch-item').forEach(item => {
        const input = item.querySelector('input[type="radio"]');
        const visual = item.querySelector('.swatch-visual');
        const paletteName = input?.value;
        const palette = THEMES.palettes.find(p => p.name === paletteName);
        if (!palette || !visual) return;

        const outlineRgb = palette.light.textFrom;
        if (input?.checked) {
          visual.style.boxShadow = `0 0 0 4px rgba(${outlineRgb}, 0.95)`;
          visual.style.transform = 'scale(1.06)';
        } else {
          visual.style.boxShadow = 'none';
          visual.style.transform = 'scale(1)';
        }
      });
    };

    THEMES.palettes.forEach(p => {
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
      visual.style.background = `rgb(${p.light.placeholderFrom})`;
      visual.style.border = '2px solid transparent';
      visual.style.boxSizing = 'border-box';

      label.appendChild(input);
      label.appendChild(visual);
      container.appendChild(label);
    });

    updateSelection();
    container.addEventListener('change', e => {
      if (e.target?.name === 'selected-theme') updateSelection();
    });
    document.querySelectorAll('input[name="theme-mode"]').forEach(r => {
      r.addEventListener('change', () => updateSelection());
    });
  }

  _applyTheme() {
    const selectedPalette = document.querySelector('input[name="selected-theme"]:checked')?.value;
    const mode = document.querySelector('input[name="theme-mode"]:checked')?.value || 'light';

    if (!selectedPalette) {
      this.toast?.show('Por favor selecciona un tema 🫡');
      return;
    }

    const current = THEMES.getCurrent();
    if (selectedPalette === current.palette && mode === current.mode) {
      this.toast?.show('Ese tema ya está seleccionado. ✨');
      return;
    }

    const applied = THEMES.setTheme(selectedPalette, mode, true);
    this.toast?.show(applied ? 'Tema aplicado ✨' : 'No se pudo aplicar el tema 😕');
  }
}
