import { Interface } from './../../interfaces.js'; 
import { CourseOfferingsService } from './../../../js/services/course-offerings.service.js';
import { Table } from './../../../components/display/table/table.js';

export default class CourseOfferingsInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none py-3">
      Mis Cursos
    </h1>
  </div>

  <div id="courses-teacher-table"></div>
</main>

<template id="tmpl-course-students">
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">
      Detalles del Curso
    </h2>

    <div class="grid grid-cols-2 gap-4 text-sm text-indigo-600">
      <div><span class="font-semibold">Aula:</span> <span id="modal-classroom">-</span></div>
      <div><span class="font-semibold">Horario:</span> <span id="modal-schedule">-</span></div>
      <div><span class="font-semibold">Grupo:</span> <span id="modal-group">-</span></div>
      <div><span class="font-semibold">Ciclo:</span> <span id="modal-cycle">-</span></div>
    </div>

    <div id="modal-students-table"></div>
  </div>
</template>
`;
  }

  async init() {
    // 1) service real (usa base Service estático que definiste)
    this.service = new CourseOfferingsService();

    // 2) tabla (usa el ciclo de tu DisplayComponent/Table)
    this.table = new Table({
      host: '#courses-teacher-table',
      service: this.service,             // instancia con .list()
      servicePrefix: 'CourseOfferings',  // para escuchar create/update/delete si lo usas
      headers: [
        { label: 'Materia',         key: 'subject' },
        { label: 'Ciclo Académico', key: 'yearcycleName' },
      ],
      searchable: true,
      sortable: true,
      paginated: true,
      perPage: 10
    });

    // 3) render del componente
    await this.table.render();

    // 4) carga de datos real + pintado (sin inventar nada)
    try {
      const data = await this.service.list();      // GET .../getAllCourseOfferings -> scope 'table'
      this.table.data = Array.isArray(data) ? data : [];

      // Fuerza pintado del body con el filtro actual (si hay SearchInput)
      const filter = this.table?.searchInput?.getValue?.() || '';
      this.table._renderBody(filter); // usamos el método interno de tu Table para pintar
    } catch (err) {
      console.error('[CourseOfferingsInterface] error cargando cursos:', err);
      const host = document.querySelector('#courses-teacher-table');
      if (host) {
        host.innerHTML = `<p class="text-sm text-red-500">Error al cargar cursos.</p>`;
      }
    }
  }
}
