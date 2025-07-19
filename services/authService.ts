import { apiClient } from "@/config/api-client";
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/types/auth";
import { StorageService } from "./storageService";

const prefix = "/auth";
const endpoints = {
  login: `${prefix}/login`,
  signup: `${prefix}/signup`,
  me: `${prefix}/me`,
};

// Serviços de autenticação
export const authService = {
  // Buscar usuário atual
  getMe: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<User>(endpoints.me);
      return response.data;
    } catch (error: any) {
      console.error("getMe: Erro na chamada:", error);
      
      // Apenas propagar o erro - a limpeza será feita pela função fetchUserAndManageAuth
      throw error;
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(endpoints.login, {
      email: credentials.email,
      password: credentials.password,
    });
    const token = response.headers["authorization"];
    apiClient.defaults.headers.common["Authorization"] = token;
    const user = response.data;

    if (token) {
      apiClient.defaults.headers.common["Authorization"] = token;
      await StorageService.setToken(token);
    }
    if (user) {
      await StorageService.setUserData(user);
    }
    return response.data;
  },

  // Signup
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(endpoints.signup, {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    });
    const token = response.headers["Authorization"];
    apiClient.defaults.headers.common["Authorization"] = token;
    const user = response.data;
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = token;
      await StorageService.setToken(token);
    }
    if (user) {
      await StorageService.setUserData(user);
    }
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await StorageService.clearAuthData();
  },

  // Verificar se há token armazenado
  hasStoredToken: async (): Promise<boolean> => {
    return await StorageService.hasToken();
  },

  // Obter token armazenado
  getToken: async (): Promise<string | null> => {
    return await StorageService.getToken();
  },

  // Obter dados do usuário armazenados
  getStoredUser: async (): Promise<User | null> => {
    return await StorageService.getUserData();
  },
};
