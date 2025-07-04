export async function init() {
    const dateTarget = document.querySelector('#main-date');
    if (dateTarget) {
        const date = new Date();
        dateTarget.textContent = date.toLocaleDateString('es-SV', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    const stats = await Promise.resolve({
        students: 1280,
        teachers: 102,
        courses: 83,
        notices: 4
    });

    const statMap = {
        '#stat-students': stats.students,
        '#stat-teachers': stats.teachers,
        '#stat-courses': stats.courses,
        '#stat-notices': stats.notices
    };

    for (const [selector, value] of Object.entries(statMap)) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    }
}
