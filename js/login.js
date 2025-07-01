import { ROUTES } from './helpers/routes.js';
import { Footer } from ROUTES.components.footer.js;
import { Toast } from ROUTES.components.toast.js;

document.addEventListener('DOMContentLoaded', async () => {

    const footer = new Footer();
    footer.load();

    const toast = new Toast();
    await toast.init();

    toast.show('Holiwis', 4000);

    const form = document.querySelector('#login-form');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    const emailTooltip = document.querySelector('#tooltip-email');
    const emailTooltipMessage = document.querySelector('#tooltip-email-msg');
    const passwordTooltip = document.querySelector('#tooltip-password');
    const passwordTooltipMessage = document.querySelector('#tooltip-password-msg');

    const btnPassword = document.querySelector('#btn-password');
    const openEye = document.querySelector('#open-eye');
    const closedEye = document.querySelector('#closed-eye');

    btnPassword.addEventListener('click', () => {
        const hidden = passwordInput.type === 'password';
        passwordInput.type = hidden ? 'text' : 'password';
        openEye.classList.toggle('hidden', !hidden);
        closedEye.classList.toggle('hidden', hidden);
    });

    function getPlacement(inputId) {
        if (window.innerWidth >= 768) return 'right';
        return inputId === 'email' ? 'top' : 'bottom';
    }

    function makeTooltip(tooltipElement, targetElement) {
        return new Tooltip(tooltipElement, targetElement, {
            placement: getPlacement(targetElement.id),
            triggerType: 'manual',
        });
    }

    let emailTtip, passwordTtip;

    function createToolTips() {
        emailTtip && emailTtip.destroy();
        passwordTtip && passwordTtip.destroy();
        emailTtip = makeTooltip(document.querySelector('#tooltip-email'), document.querySelector('#email'));
        passwordTtip = makeTooltip(document.querySelector('#tooltip-password'), document.querySelector('#password'));
    }

    window.addEventListener('resize', () => {
        createToolTips();
    });

    emailInput.addEventListener('input', () => {
        clearEmailError();
    });

    passwordInput.addEventListener('input', () => {
        clearPasswordError();
    });

    function showEmailError(msg) {
        emailTooltip.classList.remove('hidden');
        emailTooltipMessage.textContent = msg;
        emailInput.classList.add('border', 'border-red-500');
        emailTtip.show();
    }

    function clearEmailError() {
        emailTooltip.classList.add('hidden');
        emailInput.classList.remove('border', 'border-red-500');
        emailTtip.hide();
    }

    function showPasswordError(msg) {
        passwordTooltip.classList.remove('hidden');
        passwordTooltipMessage.textContent = msg;
        passwordInput.classList.add('border', 'border-red-500');
        passwordTtip.show();
    }

    function clearPasswordError() {
        passwordTooltip.classList.add('hidden');
        passwordInput.classList.remove('border', 'border-red-500');
        passwordTtip.hide();
    }

    form.addEventListener('submit', e => {
        let valid = true;
        const emailContent = emailInput.value.trim();
        const emailSafe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailContent) {
            showEmailError('El correo es obligatorio 🥺');
            valid = false;
        } else if (emailContent.length > 50) {
            showEmailError('Máximo 50 caracteres 😧');
            valid = false;
        } else if (!emailSafe.test(emailContent)) {
            showEmailError('Correo inválido 😔');
            valid = false;
        } else {
            clearEmailError();
        }
        const passwordContent = passwordInput.value;
        const passwordSafe = /^[A-Za-z0-9@#$%^&*._\-!]{1,257}$/;
        if (!passwordContent) {
            showPasswordError('La contraseña es obligatoria 🥺');
            valid = false;
        } else if (passwordContent.length < 8) {
            showPasswordError('Mínimo 8 caracteres 🙁');
            valid = false;
        } else if (passwordContent.length > 256) {
            showPasswordError('Máximo 256 caracteres 🙁');
            valid = false;
        } else if (!passwordSafe.test(passwordContent)) {
            showPasswordError('Caracteres no permitidos 😬');
            valid = false;
        } else {
            clearPasswordError();
            window.location.href(ROUTES.interfaces.app);
        }
        if (!valid) e.preventDefault();
        console.log(valid);
    });

    createToolTips();

    window.addEventListener('resize', () => {
        createToolTips();
    })
});