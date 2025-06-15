import type { AxiosInstance } from "axios";
import axios from "axios";


export const axiosClient = (): AxiosInstance => {
    return axios.create({
        baseURL: 'https://localhost:7260',
        withCredentials: true


    });
}