import axios from "axios";
import { axiosClient } from "./config";
import type { PublisherRequest } from "../request/publisherRequest";
import type { LoginRequest } from "../request/LoginRequest";

const axiosConfig = axiosClient();

export const PublisherApi = {
    addPublisher: async (data: PublisherRequest) => {
        const response = await axiosConfig.post(`/api/Publisher/AddPublisher`, data);
        return response.data;
    },
    getAllPublisher: async () => {
        const response = await axiosConfig.get(`/api/Publisher/GetAllPublisher`)
        return response.data;
    },
    updatePublisher: async (id: string, data: PublisherRequest,) => {
        const response = await axiosConfig.post(`/api/Publisher/UpdatePublisher/${id}`, data)
        return response.data;
    },
    getPublisherById: async (id: string) => {
        const response = await axiosConfig.get(`/api/Publisher/GetPublisherById/${id}`)
        return response;
    },
    deletePublisher: async (id: string) => {
        const response = await axiosConfig.post(`/api/Publisher/DeletePublisher/${id}`)
        return response;
    }
}

export const Authetication = {
    login: async (data: LoginRequest) => {
        const response = await axiosConfig.post(`/api/Authentication/Login`, data);
        return response.data;
    }
}

