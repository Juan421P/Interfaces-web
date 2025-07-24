import { ROUTES } from './../../js/helpers/routes.js';
import { UsersService } from './../../js/services/users.js';
import { isValidEmail, isValidPassword, checkInput } from '../../js/helpers/validation.js';

document.addEventListener('DOMContentLoaded', async () => {

    if (sessionStorage.getItem('userID')) {
        window.location.href = '/#main';
    }

    const { Footer } = await import(ROUTES.components.footer.js);
    const { Toast } = await import(ROUTES.components.toast.js);

    const footer = new Footer();
    footer.load();

    const toast = new Toast();
    await toast.init();

    const form = document.querySelector('#login-form');
    const emailInput = document.querySelector('#email');
    checkInput('#email', 'email');
    const passwordInput = document.querySelector('#password');
    checkInput('#password', 'password');

    const btnPassword = document.querySelector('#btn-password');
    const openEye = document.querySelector('#open-eye');
    const closedEye = document.querySelector('#closed-eye');

    btnPassword.addEventListener('click', () => {
        const hidden = passwordInput.type === 'password';
        passwordInput.type = hidden ? 'text' : 'password';
        openEye.classList.toggle('hidden', !hidden);
        closedEye.classList.toggle('hidden', hidden);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailContent = emailInput.value.trim();
        const passwordContent = passwordInput.value.trim();
        let valid = true;

        if (!emailContent) {
            toast.show('Correo: El correo es obligatorio 🥺');
            valid = false;
        } else if (emailContent.length > 50) {
            toast.show('Correo: Máximo 50 caracteres 😧');
            valid = false;
        } else if (!isValidEmail(emailContent)) {
            toast.show('Correo: Correo inválido 😔');
            valid = false;
        }
        if (!passwordContent) {
            toast.show('Contraseña: La contraseña es obligatoria 🥺');
            valid = false;
        } else if (passwordContent.length < 8) {
            toast.show('Contraseña: Mínimo 8 caracteres 🙁');
            valid = false;
        } else if (passwordContent.length > 256) {
            toast.show('Contraseña: Máximo 256 caracteres 🙁');
            valid = false;
        } else if (!isValidPassword(passwordContent)) {
            toast.show('Contraseña: Caracteres no permitidos 😥');
            valid = false;
        }

        if (!valid) return;

        try {
            const user = await UsersService.login(emailContent, passwordContent);
            window.location.href = '/#main';
        } catch (error) {
            toast.show(error.message);
        }
    });

});
