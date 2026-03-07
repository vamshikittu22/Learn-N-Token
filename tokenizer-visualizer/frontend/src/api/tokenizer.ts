import axios from 'axios'
import type { TokenizeRequest, TokenizeResponse } from '@/types'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
})

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.detail || error.response.statusText
            throw new Error(`API Error: ${message}`)
        } else if (error.request) {
            // Request made but no response
            throw new Error('No response from server. Is the backend running?')
        } else {
            // Something else happened
            throw new Error(`Request failed: ${error.message}`)
        }
    }
)

export const tokenizeText = async (
    request: TokenizeRequest
): Promise<TokenizeResponse> => {
    const response = await api.post<TokenizeResponse>('/tokenize', request)
    return response.data
}

export const getModels = async (): Promise<{ models: string[] }> => {
    const response = await api.get('/models')
    return response.data
}

export const healthCheck = async (): Promise<{ status: string }> => {
    const response = await api.get('/health')
    return response.data
}
