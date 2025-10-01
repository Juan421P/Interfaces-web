import { Interface } from './../../base/interface.js';
import { FacultiesService } from './../../../js/services/faculties.service.js';
import { buildInitials } from './../../../js/lib/common.js';

export default class FacultiesInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="w-full space-y-8">
                    <div
                        class="bg-gradient-to-bl from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] shadow-md rounded-xl p-6 flex items-center gap-6">
                        <div id="faculty-avatar"
                            class="w-14 h-14 rounded-full bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] flex items-center justify-center drop-shadow flex-shrink-0">
                        </div>
                        <div class="flex-shrink-1">
                            <p id="faculty-title"
                                class="text-lg font-semibold text-transparent select-none bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text drop-shadow">
                            </p>
                            <p id="faculty-locality"
                                class="text-sm text-transparent select-none bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text drop-shadow">
                            </p>
                        </div>
                    </div>
                    <div
                        class="px-5 py-4 border border-[rgb(var(--off-from))] rounded-lg bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] drop-shadow">
                        <span
                            class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none drop-shadow">
                            Aquí puedes administrar las <strong>Facultades</strong> y sus <strong>Localidades</strong>.
                        </span>
                    </div>
                </div>
            </main>
        `;
    }

    async init() {
        await this._loadFacultyData();
    }

    async _loadFacultyData() {
        try {
            const faculties = await FacultiesService.getAll();
            if (faculties.length > 0) {
                const faculty = faculties[0]; // Ejemplo: mostrar la primera facultad

                const titleEl = document.getElementById('faculty-title');
                if (titleEl) titleEl.textContent = faculty.facultyName;

                const localityEl = document.getElementById('faculty-locality');
                if (localityEl) localityEl.textContent = `Localidad: ${faculty.localityID}`;

                const avatarHost = document.getElementById('faculty-avatar');
                if (avatarHost) {
                    avatarHost.innerHTML = '';
                    const initials = `${faculty.facultyName[0] || ''}`.toUpperCase();
                    avatarHost.appendChild(buildInitials(initials));
                }
            }
        } catch (error) {
            console.error('[FacultiesInterface] Error cargando facultades:', error);
        }
    }

}