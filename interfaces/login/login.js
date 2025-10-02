import { Interface } from './../base/interface.js';

import {
    Form,
    FormInput,
    SubmitInput,
    Toast
} from './../../components/components.js';

import { AuthService } from './../../js/services/auth.service.js';
import { AuthGuard } from './../../js/guards/auth.guard.js';

export default class LoginInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex items-center justify-center min-h-screen mb-1 overflow-y-auto scrollbar-width-none">
                <div id="login-form-host" class="flex justify-center w-full md:justify-start md:ml-60">
                </div>
            </main>
        `;
    }

    async init() {
        if (await AuthGuard.isAuthenticated()) {
            window.location.hash = '#main';
        } else {
            await this._setupToast();
            await this._setupForm();
        }
    }

    async _setupToast() {
        this.toast = new Toast();
        await this.toast.init();
    }

    async _setupForm() {
        this.form = await new Form({
            host: '#login-form-host',
            formClass: 'gap-16 px-6 mx-auto md:mx-0 md:px-0 z-50 w-full max-w-md',
            sections: [
                {
                    opts: {
                        gap: 2,
                        classes: 'md:px-0 px-10'
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
                        gap: 6,
                        classes: 'px-10 md:px-0'
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
                        px: 0,
                        classes: 'px-0 md:px-10'
                    },
                    components: [
                        {
                            type: SubmitInput,
                            opts: {
                                id: 'submit-button',
                                text: 'Iniciar sesión',
                                additionalClasses: 'w-full px-6'
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
                    console.info('[Login] Login API call completed');
                    if (await AuthGuard.authLogin(true)) {
                        if(window.router){
                            window.router.isAuthenticated = true;
                        }
                        window.location.hash = "main";
                    } else {
                        this.toast.show('Credenciales incorrectas 😔');
                    }
                } catch (error) {
                    console.error(error);
                    this.toast.show('Error al iniciar sesión');
                }
            }
        });
    }

}