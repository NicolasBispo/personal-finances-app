import { apiClient } from "@/config/api-client";
import { useAuthToken } from "@/hooks/useAuthToken";
import { authService } from "@/services/authService";
import { User } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
  isLoadingToken: boolean;
  token: string | null;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoadingToken, token, updateToken } = useAuthToken();
  const queryClient = useQueryClient();
  const router = useRouter(); 

  // Função async para buscar usuário e gerenciar autenticação
  const fetchUserAndManageAuth = async (): Promise<User | null> => {
    try {
      // Sincronizar token com apiClient
      if (token) {
        apiClient.defaults.headers.common["Authorization"] = token;
      } else {
        delete apiClient.defaults.headers.common["Authorization"];
      }

      // Buscar usuário
      const user = await authService.getMe();
      return user;
    } catch (error) {
      // Limpar dados de autenticação
      await authService.logout();
      updateToken(null);
      router.replace("/login");
      queryClient.clear();
      
      throw error;
    }
  };

  // Query para buscar usuário atual
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth", "me", token], // Incluir token na query key para forçar refetch
    queryFn: fetchUserAndManageAuth,
    enabled: !!token && !isLoadingToken,
    retry: false,
    retryOnMount: false,
    staleTime: 0, // Sempre considerar dados como stale
    gcTime: 0, // Não usar cache
    initialData: null,
  });

  // Lógica de autenticação simplificada
  // Usuário está autenticado se:
  // 1. Há um token válido
  // 2. Não está carregando o token
  // 3. A query do usuário não falhou (não há erro)
  const isAuthenticated: boolean =
    !!token && 
    !isLoadingToken && 
    !error; // Qualquer erro = não autenticado

  // Está autenticando se está carregando o token ou dados do usuário
  const isAuthenticating: boolean = isLoadingToken || isLoading;



  

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login({ email, password }),
    onSuccess: () => {
      // Invalida e refaz a query do usuário
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => {
      console.error("Erro no login:", error);
      throw error;
    },
  });

  // Mutation para signup
  const signupMutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => authService.signup({ email, password, name }),
    onSuccess: () => {
      // Invalida e refaz a query do usuário
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => {
      console.error("Erro no signup:", error);
      throw error;
    },
  });

  // Funções de autenticação
  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signup = async (email: string, password: string, name: string) => {
    await signupMutation.mutateAsync({ email, password, name });
  };

  const logout = async () => {
    await authService.logout();
    // Atualiza o token no hook
    updateToken(null);
    // Limpa todas as queries relacionadas à autenticação
    queryClient.clear();
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
    isAuthenticated,
    login,
    signup,
    logout,
    refetchUser,
    isLoadingToken,
    token,
    isAuthenticating,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
