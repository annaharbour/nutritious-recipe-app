import axios from "axios";
import userUrl from "./endpoints";

const axiosInstance = axios.create({
    baseURL: `${userUrl}`,
})

export function getAllUsers(){
    return axiosInstance.get('/');
}

export function getUserById(id){
    return axiosInstance.get(`/${id}`);
}

export function deleteUser(id){
    return axiosInstance.delete(`/${id}`);
}