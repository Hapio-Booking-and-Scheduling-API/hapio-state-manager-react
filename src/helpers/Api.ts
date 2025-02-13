import axios from 'axios';

export const getApiClient = (config: {
    hapioBaseURL: string;
    hapioApiToken: string;
}) => {
    return axios.create({
        baseURL: config.hapioBaseURL,
        headers: {
            Authorization: `Bearer ${config.hapioApiToken}`,
        },
    });
};

export const getData = async <T>(
    config: { hapioBaseURL: string; hapioApiToken: string },
    endpoint: string
): Promise<T> => {
    const client = getApiClient(config);
    const response = await client.get<T>(endpoint);
    return response.data;
};

export const postData = async <T>(
    config: { hapioBaseURL: string; hapioApiToken: string },
    endpoint: string,
    data: any
): Promise<T> => {
    const client = getApiClient(config);
    const response = await client.post<T>(endpoint, data);
    return response.data;
};
