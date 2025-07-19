// Configurações centralizadas do projeto
export const config = {
  // Configurações da API
  api: {
    baseURL: 'http://localhost:3000', // Substitua pela sua API real
    timeout: 10000,
  },

  // Configurações de autenticação
  auth: {
    tokenKey: '@auth_token',
    userDataKey: '@user_data',
  },

  // Configurações do app
  app: {
    name: 'Personal Finances App',
    version: '1.0.0',
  },
} as const

// Tipos para as configurações
export type AppConfig = typeof config 