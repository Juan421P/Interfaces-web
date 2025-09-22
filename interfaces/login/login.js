import { ROUTES } from './../../js/lib/routes.js';
import { AuthService } from './../../js/services/auth.service.js';
import { ValidationError } from './../../js/errors/validation-error.js';
import { formatErrors } from './../../js/lib/errors.js';

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

new Form({
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
        try {
            await AuthService.login(
                ((values['email-input'] || '').trim()),
                ((values['password-input'] || '').trim())
            );
            window.location.hash = '#main';
        } catch (error) {
            toast.show((formatErrors(error)).join(' | '));
        }
    }
});