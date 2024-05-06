import axios from 'axios';
import {authURL} from './endpoints';

const axiosInstance = axios.create({
    baseURL: `${authURL}`,
})

export const login = async (email, password) => {
    try {
        const res = await axiosInstance.post('/login', {
            email,
            password,
        });
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        return res;
    } catch (error) {
        console.error(error);
    };
}

export const register = async (name, email, phone, password) => {
    try {
        const res = await axiosInstance.post('/register', {
            name,
            email,
            phone,
            password,
        });
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        return res;
    } catch (error) {
        console.error(error);
    };
}

export function setAuthToken(token){
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}