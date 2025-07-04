import { fetchJSON } from './../helpers/network';

const ENDPOINT = '/users/me';

export const UsersService = {
    me(){
        const [user] = [{
            firstName: 'Fernando Miguel',
            lastname: 'Velásquez Pérez',
            role: 'Adminsitrador',
            image: 'https://i.imgur.com/FWqraiq.jpeg'
        }];
        return {
            firstName: user.firstName,
            lastName: user.lastname,
            image: user.image,
            role: user.role
        }
    }
}