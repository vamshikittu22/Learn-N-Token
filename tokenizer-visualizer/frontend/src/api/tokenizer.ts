import axios, { AxiosError } from 'axios';
import {
    TokenizeRequest, TokenizeResponse, ErrorResponse,
    CompareRequest, CompareResponse, AttentionRequest, AttentionResponse
} from '../types';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
        if (error.response?.data?.detail) {
            return Promise.reject(new Error(error.response.data.detail));
        }
        return Promise.reject(error);
    }
);

export const tokenizeText = async (data: TokenizeRequest): Promise<TokenizeResponse> => {
    const response = await api.post<TokenizeResponse>('/tokenize', data);
    return response.data;
};

export const getModels = async (): Promise<string[]> => {
    const response = await axios.get<{ models: string[] }>('/models');
    return response.data.models;
};

export const healthCheck = async (): Promise<{ status: string }> => {
    const response = await axios.get<{ status: string }>('/health');
    return response.data;
};

export const compareTexts = async (
    text1: string,
    text2: string,
    model: TokenizeRequest['model']
): Promise<CompareResponse> => {
    const response = await api.post<CompareResponse>('/compare', { text1, text2, model });
    return response.data;
};

export const getAttention = async (text: string): Promise<AttentionResponse> => {
    const response = await api.post<AttentionResponse>('/attention', { text, model: 'bert-base-uncased' });
    return response.data;
};
