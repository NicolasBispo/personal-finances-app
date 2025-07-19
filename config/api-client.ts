import { StorageService } from '@/services/storageService'
import axios from 'axios'
import { config } from './index'

// Configuração base do axios
export const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para adicionar token em todas as requisições
apiClient.interceptors.request.use(async (config) => {
  const token = await StorageService.getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Interceptor para tratar erros de autenticação
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - apenas remover token do header padrão
      // A limpeza dos dados será feita pelo AuthProvider
      delete apiClient.defaults.headers.common['Authorization']
    }
    return Promise.reject(error)
  }
) 