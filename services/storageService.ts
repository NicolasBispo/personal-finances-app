import { config } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Chaves para armazenamento
const STORAGE_KEYS = {
  AUTH_TOKEN: config.auth.tokenKey,
  USER_DATA: config.auth.userDataKey,
} as const

export class StorageService {
  // Token de autenticação
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Erro ao buscar token:', error)
      return null
    }
  }

  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    } catch (error) {
      console.error('Erro ao salvar token:', error)
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Erro ao remover token:', error)
    }
  }

  static async hasToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      return !!token
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      return false
    }
  }

  // Dados do usuário
  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }
  }

  static async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error)
    }
  }

  static async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
    } catch (error) {
      console.error('Erro ao remover dados do usuário:', error)
    }
  }

  // Limpar todos os dados de autenticação
  static async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ])
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error)
    }
  }

  // Método genérico para armazenar qualquer dado
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)
      await AsyncStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Erro ao salvar item ${key}:`, error)
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.error(`Erro ao buscar item ${key}:`, error)
      return null
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover item ${key}:`, error)
    }
  }

  // Limpar todo o storage
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error('Erro ao limpar storage:', error)
    }
  }
} 