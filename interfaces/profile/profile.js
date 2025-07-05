import { StatsService } from './../../js/services/stats.js';
import { NotificationsService } from './../../js/services/notifications.js';
import { AuditService } from './../../js/services/audit.js';
import { buildInitials } from './../../js/helpers/common-methods.js';
import { storage } from './../../js/helpers/index.js';

export async function init() {
    const user = storage.get('user');
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
    await renderKPIs(user.universityID);
    await renderNotifications(user.userID);
    await renderAuditLog(user.userID);
}

function renderAvatar(user, person) {
    const host = document.querySelector('#profile-avatar-main');
    host.innerHTML = '';

    if (user.image) {
        const img = document.createElement('img');
        img.src = user.image;
        img.className = 'rounded-full object-cover';
        img.onerror = () =>
            host.appendChild(buildInitials(person.firstName[0] + person.lastName[0]));
        host.appendChild(img);
    } else {
        host.appendChild(buildInitials(person.firstName[0] + person.lastName[0]));
    }
}

function renderUserInfo(person, user, role) {
    document.querySelector('#profile-name').textContent =
        `${person.firstName} ${person.lastName}`;
    document.querySelector('#profile-role').textContent =
        role.roleName || 'Rol desconocido';
    document.querySelector('#profile-email').textContent =
        person.contactEmail || user.email;
}

async function renderKPIs(universityID) {
    const kpis = await StatsService.adminSnapshot(universityID);
    const grid = document.querySelector('#kpi-grid');
    grid.innerHTML = '';

    const map = {
        Facultades: kpis.faculties,
        Departamentos: kpis.departments,
        Carreras: kpis.careers,
        Estudiantes: kpis.students,
        Profesores: kpis.teachers,
        Cursos: kpis.courses
    };

    for (const [label, value] of Object.entries(map)) {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-bl from-indigo-50 to-blue-50 rounded-lg shadow p-4';
        card.innerHTML = `
            <p class="text-sm text-indigo-400">${label}</p>
            <p class="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">${value}</p>`;
        grid.appendChild(card);
    }
}

async function renderNotifications(userID) {
    const container = document.querySelector('#latest-notifs');
    container.innerHTML = '';

    const notifs = await NotificationsService.list({ userID, limit: 3 });

    notifs.forEach(n => {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-tr from-indigo-50 to-blue-50 text-indigo-700 rounded-lg shadow p-4';
        card.innerHTML = `
            <p class="font-semibold">${n.title}</p>
            <p class="text-sm text-indigo-500">${n.body || ''}</p>
            <p class="text-xs text-indigo-400 mt-2">${new Date(n.sentAt).toLocaleString()}</p>
        `;
        container.appendChild(card);
    });
}

async function renderAuditLog(userID) {
    const container = document.querySelector('#audit-log');
    container.innerHTML = '';

    const audits = await AuditService.recent(userID, 5);

    audits.forEach(a => {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-tr from-indigo-50 to-blue-50 text-indigo-700 rounded-lg shadow p-4';
        card.innerHTML = `
            <p class="text-sm text-indigo-600">${a.operationType} en <span class="font-semibold">${a.affectedTable}</span></p>
            <p class="text-xs text-indigo-400">Registro #${a.recordID} • ${new Date(a.operationAt).toLocaleString()}</p>
        `;
        container.appendChild(card);
    });
}

