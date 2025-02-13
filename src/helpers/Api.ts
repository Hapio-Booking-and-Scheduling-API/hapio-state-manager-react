import axios from 'axios';
import { useHapioBookingStore } from '../hapio-ui-state-management';

const getApiClient = () => {
    const { config } = useHapioBookingStore.getState();
    return axios.create({
        baseURL: config.hapioBaseURL,
        headers: {
            Authorization: `Bearer ${config.hapioApiToken}`,
        },
    });
};

export const getData = async <T>(endpoint: string): Promise<T> => {
    const client = getApiClient();
    const response = await client.get<T>(endpoint);
    return response.data;
};

export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
    const client = getApiClient();
    const response = await client.post<T>(endpoint, data);
    return response.data;
};
