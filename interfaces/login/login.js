import { ROUTES } from './../../js/lib/routes.js';
import { AuthService } from './../../js/services/auth.service.js';

const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);
const { SubmitInput } = await import(ROUTES.components.submitInput.js);
const { Footer } = await import(ROUTES.components.footer.js);
const { Toast } = await import(ROUTES.components.toast.js);

// if (sessionStorage.getItem('userID')) {
//     window.location.href = '/#main';
// }

await new Footer();

const toast = new Toast();
await toast.init();

await new Form({
    host: '#login-form-host',
    templateId: 'login-form-template',
    components: [
        {
            type: FormInput,
            opts: {
                id: 'email-input',
                type: 'text',
                placeholder: 'Correo electrónico',
                validationMethod: 'email'
            },
            validation: ['email']
        },
        {
            type: FormInput,
            opts: {
                id: 'password-input',
                type: 'password',
                placeholder: 'Contraseña',
                validationMethod: 'password'
            },
            validation: ['password']
        },
        {
            type: SubmitInput,
            opts: {
                id: 'submit-button',
                text: 'Iniciar sesión'
            }
        }
    ],
    onSubmit: async (values) => {
        const emailContent = (values['email-input'] || '').trim();
        const passwordContent = (values['password-input'] || '').trim();
        try {
            await AuthService.login(emailContent, passwordContent);
        } catch (error) {
            toast.show(error.message);
        }
    }
});