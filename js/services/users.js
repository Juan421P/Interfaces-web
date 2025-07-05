import { fetchJSON } from './../helpers/network';
import { storage } from './../helpers';

const ENDPOINT = '/aMIj5J/users';
const SESSION_KEY = 'user';

export const UsersService = {
    async list() {
        return fetchJSON(ENDPOINT);
    },

    async getByEmail(email) {
        const users = await fetchJSON(`${ENDPOINT}?email=${email}`);
        return users.length > 0 ? users[0] : null;
    },

    async login(email, password){
        const user = await UsersService.getByEmail(email);
        if(!user) throw new Error('Usuario no encontrado 🥺');
        if(user.password.toString() !== password.toString()) throw new Error('Contraseña incorrecta 🥺');
        storage.set(SESSION_KEY, user);
        return user;
    },

    async logout(){
        storage.remove(SESSION_KEY);
    }
};