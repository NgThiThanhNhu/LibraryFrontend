import axios from "axios";
import { BASE_URL } from "./config";
import type { PublisherRequest } from "../request/publisherRequest";

const PublisherApi = {
    addPublisher: async (data: PublisherRequest) => {
        const response = await axios.post(`${BASE_URL}/api/Publisher/AddPublisher`, data);
        return response.data;
    },
    getAllPublisher: async () => {
        const response = await axios.get(`${BASE_URL}/api/Publisher/GetAllPublisher`)
        return response.data;
    },
    updatePublisher: async (id: string, data: PublisherRequest,) => {
        const response = await axios.post(`${BASE_URL}/api/Publisher/UpdatePublisher/${id}`, data)
        return response.data;
    },
    getPublisherById: async (id: string) => {
        const response = await axios.get(`${BASE_URL}/api/Publisher/GetPublisherById/${id}`)
        return response;
    },
    deletePublisher: async (id: string) => {
        const response = await axios.post(`${BASE_URL}/api/Publisher/DeletePublisher/${id}`)
        return response;
    }
}
export default PublisherApi;
