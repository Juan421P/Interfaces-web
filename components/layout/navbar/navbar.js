import { Component, Modal, Button } from './../../components.js';

import { AuthService } from './../../../js/services/auth.service.js';
import { buildInitials } from './../../../js/lib/common.js';
import { ComponentRenderError } from './../../../js/errors/components/base/component-render-error.js';

const getLabelSpan = (element) => element.querySelector('span:not(.profile-initials)');

export class Navbar extends Component {

	static getTemplate() {
		return `
<template id="tmpl-navbar">
<button id="burger-btn"
    class="fixed z-50 p-2 text-[rgb(var(--text-from))] dark:text-[rgb(var(--card-from))] bg-[rgb(var(--body-from))] dark:bg-[rgb(var(--button-from))] shadow-md top-4 left-4 rounded-xl md:hidden backdrop-blur drop-shadow">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
</button>
<div id="sidebar-wrapper"
    class="fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform -translate-x-full w-80 md:translate-x-0 scrollbar-width-none">
    <aside id="sidebar"
        class="flex flex-col w-full h-full gap-6 px-4 py-6 overflow-y-auto bg-[rgb(var(--body-from))]/70 backdrop-blur md:bg-transparent md:backdrop-blur-0 scrollbar-width-none">
        <header class="flex items-center justify-between px-2">
            <div class="flex items-center justify-between flex-1 gap-2">
                <svg width="64" height="80" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="hidden transition-all duration-200 md:block drop-shadow">
                    <defs>
                        <linearGradient id="header-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="rgb(var(--button-from))" />
                            <stop offset="100%" stop-color="rgb(var(--button-to))" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M47.58,40.67a.83.83,0,0,0-.58,0H45.7l1-1a.89.89,0,0,0,0-1.2.8.8,0,0,0-1.1,0l-1,1a22,22,0,0,0-3.5-5.8l-.6-6.1a2.2,2.2,0,0,0-2.36-2,1,1,0,0,0-.24,0l-6.1,1a16.56,16.56,0,0,0-4.13-1.25A12.79,12.79,0,0,0,32,21.8c.4,1.6,1.6,5.3,3.9,3.5,0,0,2.39-1.49-1-3.69.4.18,6.49,2.9,6.68-2.61a.8.8,0,0,0-.82-.78.83.83,0,0,0-.48.18,5.37,5.37,0,0,1-2.2.4s6.3-3.6,2.2-6.4a1.21,1.21,0,0,0-1.65.4,1.49,1.49,0,0,0-.15.4s-1.3,3.6-4.6,4.4a9.15,9.15,0,0,0,.1-3.3,10.11,10.11,0,0,0-4.1-6.5C20.6-4.7,4.7,1.6,4.7,1.6L12,10.9A9.51,9.51,0,0,0,10.3,18a10.34,10.34,0,0,0,7.29,8.11A20.55,20.55,0,0,0,13.7,28L7.6,27A2.21,2.21,0,0,0,5,28.76L5,29l-.9,9.2a16,16,0,0,0-1.8,6.7c0,.5.1,1,.1,1.4H.8a.9.9,0,0,0-.8.9.89.89,0,0,0,.8.8H2.6l-1.5.7a.7.7,0,0,0-.45.88.61.61,0,0,0,0,.12.8.8,0,0,0,1,.5l1.2-.6-.6,1.3A.89.89,0,0,0,2.7,52a.81.81,0,0,0,1.08-.35s0,0,0,0l.3-.7C7.5,56.3,15.1,60,24,60c12,0,21.7-6.8,21.7-15.1v-.6l.8.3a.7.7,0,0,0,.94-.32.55.55,0,0,0,.06-.18.71.71,0,0,0-.28-1l-.12,0-1.7-.6h1.7v-.1a.9.9,0,1,0,.48-1.73ZM21,4.5c.4,0,.7.7.7,1.5s-.3,1.4-.7,1.4-.7-.6-.7-1.4S20.6,4.5,21,4.5Zm-2.6,7.3c.2-.1.3.1.3.2s.5,7.4,8,7.4h.1c.2,0,4.1,0,5.6-3.2L25.7,9.5a.2.2,0,0,1,0-.28l0,0h.4L32.9,16v.2c-1.6,3.8-6.1,3.7-6.1,3.7h-.1c-8,0-8.5-7.8-8.5-7.9Zm10,32.3h-.6a2.68,2.68,0,0,1-1.4-.4,1.84,1.84,0,0,1-.5-.7l-.4.6a2.58,2.58,0,0,1-2.1.8.29.29,0,0,1-.3-.3c0-.1.1-.2.3-.2a1.79,1.79,0,0,0,1.7-.7,1.4,1.4,0,0,0,.4-1V42L25,42c-1.37,0-2.43-.39-2.52-1s1.2-1.2,2.8-1.4,2.8.3,2.9,1S27.3,41.8,26,42v.3a3,3,0,0,0,.7,1.1,2.53,2.53,0,0,0,1.6.2l.3.2C28.6,43.9,28.6,44.1,28.4,44.1Z"
                        transform="translate(0 -0.01)" fill="url(#header-gradient)" />
                </svg>
                <a href="#news" id="bell-btn"
                    class="relative p-2 ml-auto rounded-full cursor-pointer md:ml-0 group">
                    <svg xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-6 h-6 text-[rgb(var(--button-from))] transition-all duration-300 stroke-current hover:scale-105 drop-shadow fill-none">
                        <path d="M15 18h-5" />
                        <path d="M18 14h-8" />
                        <path
                            d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
                        <rect width="8" height="4" x="10" y="6" rx="1" />
                    </svg>
                    <!-- <span id="bell-dot"
                        class="absolute w-3 h-3 bg-red-500 rounded-full opacity-75 -top-1 -right-1 animate-ping">
                    </span>
                    <span id="bell-dot-static" class="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500">
                    </span> -->
                </a>
            </div>
        </header>
        <nav class="flex-1">
            <ul class="space-y-2">
                <!-- PÁGINA PRINCIPAL -->
                <li>
                    <a href="#main"
                        class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:shadow-lg nav-btn"
                        data-hash="#main">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M3 9.5l9-7 9 7V19a2 2 0 0 1-2 2h-5v-5H10v5H5a2 2 0 0 1-2-2Z" />
                            </svg>
                            <span
                                class="flex-1 font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:bg-gradient-to-r group-hover:font-medium drop-shadow group-hover:text-white">
                                Página Principal
                            </span>
                        </div>
                    </a>
                </li>
                <!-- MÓDULO DE SISTEMA -->
                <li>
                    <div
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn">
                        <button type="button" data-toggle="collapse" data-target="#mod-system"
                            class="flex items-center justify-between w-full px-5 py-4 text-[rgb(var(--button-from))] transition-colors duration-300 cursor-pointer rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <div class="flex items-center gap-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                    <path d="M3 3h18v18H3V3Z" />
                                </svg>
                                <span
                                    class="font-medium transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                    Sistema
                                </span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="w-4 h-4 text-[rgb(var(--button-from))] transition-transform duration-300 group-hover:text-white drop-shadow">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <ul id="mod-system"
                            class="rounded-b-lg pl-9 py-6 space-y-1 hidden hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] group-hover:bg-gradient-to-tr group-hover:from-[rgb(var(--body-from))] group-hover:to-[rgb(var(--body-to))]">
                            <li><a href="#system-users"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Usuarios</a>
                            </li>
                            <li><a href="#system-roles"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Roles</a>
                            </li>
                            <li><a href="#system-codes"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Códigos</a>
                            </li>
                            <li><a href="#system-audit"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Auditoría</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <!-- MÓDULO DE PLANIFICACIÓN -->
                <li>
                    <div
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn">
                        <button type="button" data-toggle="collapse" data-target="#mod-planification"
                            class="flex items-center justify-between w-full px-5 py-4 text-[rgb(var(--button-from))] transition-colors duration-300 cursor-pointer rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <div class="flex items-center gap-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                    <path d="M2 3h20" />
                                    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                                    <path d="m7 21 5-5 5 5" />
                                </svg>
                                <span
                                    class="font-medium transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                    Planificación
                                </span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="w-4 h-4 text-[rgb(var(--button-from))] transition-transform duration-300 group-hover:text-white drop-shadow">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <ul id="mod-planification"
                            class="rounded-b-lg pl-9 py-6 space-y-1 hidden hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] group-hover:bg-gradient-to-tr group-hover:from-[rgb(var(--body-from))] group-hover:to-[rgb(var(--body-to))]">
                            <li>
                                <a href="#planification-university"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Universidad</a>
                            </li>
                            <li>
                                <a href="#planification-localities"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Localidades</a>
                            </li>
                            <li>
                                <a href="#planification-faculties"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Facultades</a>
                            </li>
                            <li>
                                <a href="#planification-departments"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Departamentos</a>
                            </li>
                            <li>
                                <a href="#planification-careers"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Carreras</a>
                            </li>
                            <li>
                                <a href="#planification-pensums"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Pensums</a>
                            </li>
                            <li>
                                <a href="#planification-subjects"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Materias</a>
                            </li>
                            <li>
                                <a href="#planification-cycles"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Ciclos</a>
                            </li>
                            <li>
                                <a href="#planification-dates"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Fechas
                                    Académicas</a>
                            </li>
                            <li>
                                <a href="#planification-modalities"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Modalidades</a>
                            </li>
                            <li>
                                <a href="#planification-titles"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Títulos</a>
                            </li>
                            <li>
                                <a href="#planification-degrees"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Grados</a>
                            </li>
                            <li>
                                <a href="#planification-service"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Servicio
                                    Social</a>
                            </li>
                            <li>
                                <a href="#planification-documents"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Documentos</a>
                            </li>
                            <li>
                                <a href="#planification-evaluation-instruments"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Instrumentos</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <!-- MÓDULO DE RECURSOS HUMANOS -->
                <li>
                    <div
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">

                        <a href="#hr-employees"
                            class="flex items-center gap-5 px-5 py-4 text-[rgb(var(--button-from))] transition-colors duration-300 rounded-xl hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span
                                class="font-medium transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Empleados
                            </span>
                        </a>
                    </div>
                </li>
                <!-- MÓDULO DE REGISTRO ACADÉMICO -->
                <li>
                    <div
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn">
                        <button type="button" data-toggle="collapse" data-target="#mod-ar"
                            class="flex items-center justify-between w-full px-5 py-4 text-[rgb(var(--button-from))] transition-colors duration-300 cursor-pointer rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <div class="flex items-center gap-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                    <path d="M4 19.5A8.38 8.38 0 0 1 12 15a8.38 8.38 0 0 1 8 4.5" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span
                                    class="font-medium transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                    Registro Académico
                                </span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="w-4 h-4 text-[rgb(var(--button-from))] transition-transform duration-300 group-hover:text-white drop-shadow">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <ul id="mod-ar"
                            class="rounded-b-lg pl-9 py-6 space-y-1 hidden hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] group-hover:bg-gradient-to-tr group-hover:from-[rgb(var(--body-from))] group-hover:to-[rgb(var(--body-to))]">
                            <li><a href="#ar-students"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Estudiantes</a>
                            </li>
                            <li><a href="#ar-career-enrollments"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Inscripciones
                                    Carreras</a></li>
                            <li><a href="#ar-cycle-enrollments"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Inscripciones
                                    Ciclos</a></li>
                            <li><a href="#ar-course-enrollments"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Inscripciones
                                    Cursos</a></li>
                            <li><a href="#ar-student-performance"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Rendimiento</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <!-- MÓDULO DE PORTAL DE DOCENTE -->
                <li>
                    <a href="#tp-courses"
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                            </svg>
                            <span
                                class="font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Cursos
                            </span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#tp-evaluation-plans"
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M4 4h16v16H4V4Z" />
                                <path d="M4 10h16" />
                            </svg>
                            <span
                                class="font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Planes de Evaluación
                            </span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#tp-evaluations"
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                            </svg>
                            <span
                                class="font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Evaluaciones
                            </span>
                        </div>
                    </a>
                </li>
                <!-- MÓDULO DE PORTAL DE ESTUDIANTE -->
                <li>
                    <a href="#sp-evaluations"
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M4 4h16v16H4V4Z" />
                                <path d="M4 10h16" />
                            </svg>
                            <span
                                class="font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Evaluaciones
                            </span>
                        </div>
                    </a>
                </li>
                <li>
                    <div
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn">
                        <button type="button" data-toggle="collapse" data-target="#mod-sp-enrollments"
                            class="flex items-center justify-between w-full px-5 py-4 text-[rgb(var(--button-from))] transition-colors duration-300 cursor-pointer rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <div class="flex items-center gap-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                    <path d="M4 4h16v16H4V4Z" />
                                    <path d="M12 8v8" />
                                    <path d="M8 12h8" />
                                </svg>
                                <span
                                    class="font-medium transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                    Inscripciones
                                </span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="w-4 h-4 text-[rgb(var(--button-from))] transition-transform duration-300 group-hover:text-white drop-shadow">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <ul id="mod-sp-enrollments"
                            class="rounded-b-lg pl-9 py-6 space-y-1 hidden hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] group-hover:bg-gradient-to-tr group-hover:from-[rgb(var(--body-from))] group-hover:to-[rgb(var(--body-to))]">
                            <li><a href="#sp-enrollments-cycles"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Inscripción
                                    Ciclos</a>
                            </li>
                            <li><a href="#sp-enrollments-courses"
                                    class="block px-3 py-1 text-[rgb(var(--button-from))] rounded hover:text-[rgb(var(--text-from))]">Inscripción
                                    Materias</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <a href="#sp-pensum"
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M4 19.5A8.38 8.38 0 0 1 12 15a8.38 8.38 0 0 1 8 4.5" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span
                                class="font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Pensum
                            </span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#sp-grades"
                        class="group block rounded-xl hover:bg-gradient-to-tr hover:from-[rgb(var(--body-from))] hover:to-[rgb(var(--body-to))] hover:shadow-lg transition-shadow duration-300 nav-btn cursor-pointer">
                        <div
                            class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                <path d="M12 20h9" />
                                <path d="M12 4v16" />
                                <path d="M8 8H4v8h4" />
                            </svg>
                            <span
                                class="font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                Notas
                            </span>
                        </div>
                    </a>
                </li>
                <!-- PERFIL -->
                <li>
                    <a href="#profile"
                        class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:shadow-lg nav-btn"
                        data-hash="#profile">
                        <div class="flex items-center gap-5 px-5 py-4 transition-colors duration-300 inner rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]"
                            id="nav-profile">
                            <div class="flex items-center justify-center h-14 w-14 profile-avatar" id="profile-avatar">
                            </div>
                            <span
                                class="flex-1 font-medium text-[rgb(var(--button-from))] transition-all duration-300 select-none group-hover:bg-clip-text group-hover:text-white group-hover:font-medium drop-shadow">Mi
                                Perfil</span>
                        </div>
                    </a>
                </li>
                <!-- CERRAR SESIÓN -->
                <li>
                    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:shadow-lg nav-btn"
                        id="logout-btn">
                        <button type="button"
                            class="flex items-center justify-between w-full px-5 py-4 text-[rgb(var(--button-from))] transition-colors duration-300 cursor-pointer rounded-xl group-hover:bg-gradient-to-r group-hover:from-[rgb(var(--button-from))] group-hover:to-[rgb(var(--button-to))]">
                            <div class="flex items-center gap-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="flex-shrink-0 w-5 h-5 text-[rgb(var(--button-from))] transition-colors duration-300 group-hover:text-white drop-shadow">
                                    <path d="m16 17 5-5-5-5" />
                                    <path d="M21 12H9" />
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                </svg>
                                <span
                                    class="font-medium transition-all duration-300 select-none group-hover:text-white drop-shadow">
                                    Cerrar Sesión
                                </span>
                            </div>
                        </button>
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
</div>
<template id="tmpl-logout-confirm">
    <div class="flex flex-col gap-10 p-10 mx-auto">
        <div class="text-left">
            <span
                class="min-w-full text-3xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none text-left">
                ¿Cerrar sesión?
            </span>
            <p
                class="mt-2 font-semibold text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none text-left">
                Su sesión se cerrará y volverá al inicio de sesión.
            </p>
        </div>
        <div class="flex justify-end gap-4">
            <div id="logout-confirm" class="group"></div>
        </div>
    </div>
</template>
</template>
    `;
	}

	constructor(opts = {}) {
		const host = document.querySelector('#navbar');

		if (!host) {
			console.error('Navbar host (#navbar) not found, will retry...');
			super({
				host: document.createElement('div'),
				autoRender: false
			});
			this._retryRender();
			return;
		}

		super({
			host,
		});
	}

	async _retryRender() {
		await new Promise(r => setTimeout(r, 100));
		const host = document.querySelector('#navbar');
		if (host) {
			this.host = host;
			await this.render();
		} else {
			console.error('Navbar host still not found after retry');
		}
	}

	async _render() {
		try {
			const t = document.createElement('template');
			t.innerHTML = Navbar.getTemplate();
			const rootTpl = t.content.querySelector('#tmpl-navbar');
			if (!rootTpl) throw new Error('Navbar template missing');

			const frag = rootTpl.content.cloneNode(true);
			await this.filterByRole(frag);

			this.host.innerHTML = '';
			this.host.appendChild(frag);

			await this.injectProfilePicture();
			this.attachCollapses();
			this.highlightActive();
			window.addEventListener('hashchange', () => this.highlightActive());
			this.attachLogoutHandler();
		} catch (error) {
			console.error('Navbar render failed:', error);
			throw new ComponentRenderError('Navbar', 'rendering', error);
		}
	}

	async attachLogoutHandler() {
		const btn = document.querySelector('#logout-btn');
		if (!btn) {
			console.warn('Logout button not found');
			return;
		}

		btn.addEventListener('click', async () => {
			const logoutModal = new Modal({
				templateId: 'tmpl-logout-confirm',
				size: 'sm',
				components: [
					{
						type: Button,
						opts: {
							host: '#logout-confirm',
							text: 'Confirmar',
							buttonType: 2,
							onClick: (e) => {
								e.preventDefault();
								AuthService.logout();
								logoutModal.close();
								window.location.href = '/#login';
							},
							showIcon: false,
							sizeMultiplier: .75
						}
					}
				]
			});
		});
	}

	async injectProfilePicture() {
		try {
			const user = (await AuthService.me()).user;
			const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
			const avatarHost = document.querySelector('#profile-avatar');
			if (!avatarHost) {
				console.warn('Profile avatar host not found');
				return;
			}
			avatarHost.innerHTML = '';
			avatarHost.appendChild(buildInitials(initials || '?'));
		} catch (err) {
			console.error('[Navbar] user fetch failed:', err);
		}
	}

	highlightActive() {
		const hash = window.location.hash || '#main';

		document.querySelectorAll('#sidebar .nav-btn').forEach(entry => {
			entry.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'shadow-lg');
			entry.querySelectorAll('svg').forEach(s => s.classList.remove('text-white'));
			const sp = getLabelSpan(entry);
			sp?.classList.remove('text-white');
			sp?.classList.add('text-[rgb(var(--button-from))]');
			entry.querySelector('ul')?.classList.remove('bg-gradient-to-tr', 'from-[rgb(var(--body-from))]', 'to-[rgb(var(--body-to))]');
		});

		const activeLink = document.querySelector(`#sidebar a[href="${hash}"]`);
		const entry = activeLink?.closest('.nav-btn');
		if (!entry) return;

		entry.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'shadow-lg');
		entry.querySelectorAll('svg').forEach(s => s.classList.add('text-white'));

		const sp = getLabelSpan(entry);
		if (sp) {
			sp.classList.add('text-white');
			sp.classList.remove('text-[rgb(var(--button-from))]');
			const isCollapsed = entry.querySelector('ul')?.classList.contains('hidden');

			sp.dataset.originalLabel ??= sp.textContent;

			if (activeLink && isCollapsed) {
				sp.textContent = activeLink.textContent.trim();
			} else {
				sp.textContent = sp.dataset.originalLabel;
			}
		}

		entry.querySelector('ul')?.classList.add('bg-gradient-to-tr', 'from-[rgb(var(--body-from))]', 'to-[rgb(var(--body-to))]');
	}

	attachCollapses() {
		document.querySelectorAll('[data-toggle="collapse"]').forEach(btn => {
			const selector = btn.dataset.target;
			const target = selector ? document.querySelector(selector) : null;
			if (!target) {
				console.warn('[Navbar] collapse target not found:', selector);
				return;
			}
			btn.addEventListener('click', () => {
				const targetIsHidden = target.classList.contains('hidden');
				target.classList.toggle('hidden');
				btn.querySelector('svg:last-child')?.classList.toggle('rotate-180');

				const span = getLabelSpan(btn);
				if (!span) return;

				span.dataset.originalLabel ??= span.textContent;

				if (targetIsHidden) {
					span.textContent = span.dataset.originalLabel;
				} else {
					const hash = window.location.hash || '#main';
					const activeLink = target.querySelector(`a[href="${hash}"]`);
					if (activeLink) {
						span.textContent = activeLink.textContent.trim();
					} else {
						span.textContent = span.dataset.originalLabel;
					}
				}
			});
		});
	}

	async filterByRole(root) {
		try {
			const role = ((await AuthService.me()).user).roleID;

			const allowedMap = {
				'Administrador': ['#system-', '#planification-'],
				'Recursos Humanos': ['#hr-'],
				'Registro Académico': ['#ar-'],
				'Docente': ['#tp-'],
				'Estudiante': ['#sp-']
			};

			const allowedPrefixes = allowedMap[role] || [];

			root.querySelectorAll('a[href]').forEach(link => {
				const hash = link.getAttribute('href');
				const isGlobal = ['#main', '#notifications', '#not-found', '#profile'].includes(hash);
				if (!isGlobal && !allowedPrefixes.some(pref => hash.startsWith(pref))) {
					link.closest('li')?.remove();
				}
			});

			root.querySelectorAll('ul').forEach(ul => {
				if (!ul.querySelector('li')) {
					ul.closest('.nav-btn')?.remove();
				}
			});
		} catch (err) {
			console.error('[Navbar] role filtering failed:', err);
		}
	}
}