import { ROUTES } from './../../js/lib/routes.js';
import { AuthService } from './../../js/services/auth.service.js';
import { ValidationError } from './../../js/errors/validation-error.js';
import { AuthGuard } from '../../js/guards/auth.guard.js';

const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);
const { SubmitInput } = await import(ROUTES.components.submitInput.js);
const { Footer } = await import(ROUTES.components.footer.js);
const { Toast } = await import(ROUTES.components.toast.js);

await new Footer();

const toast = new Toast();
await toast.init();

new Form({
    host: '#login-form-host',
    formClass: 'gap-16 px-6 mx-auto md:mx-0 md:px-0 z-50 w-full',
    sections: [
        {
            opts: {
                gap: 2,
            },
            titles: [
                {
                    text: 'Inicio de sesión',
                    relevance: 1,
                    classes: [
                        'text-3xl', 'font-bold', 'text-left',
                        'bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]',
                        'bg-clip-text', 'text-transparent'
                    ]
                },
                {
                    text: '¡Bienvenido!',
                    relevance: 3,
                    classes: [
                        'text-lg', 'font-semibold', 'text-left',
                        'bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]',
                        'bg-clip-text', 'text-transparent'
                    ]
                }
            ]
        },
        {
            opts: {
                gap: 6
            },
            components: [
                {
                    type: FormInput,
                    opts: {
                        id: 'email-input',
                        type: 'text',
                        placeholder: 'Correo electrónico'
                    },
                    validation: ['email']
                },
                {
                    type: FormInput,
                    opts: {
                        id: 'password-input',
                        type: 'password',
                        placeholder: 'Contraseña'
                    },
                    validation: ['password']
                }
            ]
        },
        {
            opts: {
                gap: 4,
                px: 10
            },
            components: [
                {
                    type: SubmitInput,
                    opts: {
                        id: 'submit-button',
                        text: 'Iniciar sesión'
                    }
                }
            ]
        }
    ],
    onSubmit: async (values) => {
        try {
            await AuthService.login(
                (values['email-input'] || '').trim(),
                (values['password-input'] || '').trim()
            );

            const ok = await AuthGuard.authLogin();
            if (ok) {
                window.location.hash = '#main';
            } else {
                toast.show("Sesión no válida");
            }
        } catch (error) {
            console.error(error);
            toast.show("Error al iniciar sesión");
        }
    }
});