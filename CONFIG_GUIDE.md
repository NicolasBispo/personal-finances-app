# Estrutura de Configuração

Este projeto usa uma estrutura organizada de configuração centralizada na pasta `config/`.

## 🏗️ Estrutura

```
config/
├── index.ts      # Configurações centralizadas
└── api.ts        # Configuração do axios
```

## 📁 Arquivos

### `config/index.ts`
Configurações centralizadas do projeto:
```typescript
export const config = {
  api: {
    baseURL: 'https://api.exemplo.com',
    timeout: 10000,
  },
  auth: {
    tokenKey: '@auth_token',
    userDataKey: '@user_data',
  },
  app: {
    name: 'Personal Finances App',
    version: '1.0.0',
  },
}
```

### `config/api.ts`
Configuração do cliente HTTP:
- Instância do axios
- Interceptors para autenticação
- Tratamento de erros

## 🚀 Como Usar

### 1. Importar Configurações
```typescript
import { config } from '@/config'

// Usar configurações
const apiUrl = config.api.baseURL
const appName = config.app.name
```

### 2. Usar API Client
```typescript
import { api } from '@/config/api'

// Fazer requisições
const response = await api.get('/users')
```

### 3. Adicionar Novas Configurações
```typescript
// Em config/index.ts
export const config = {
  // ... configurações existentes
  newFeature: {
    enabled: true,
    timeout: 5000,
  },
}
```

## 🎯 Benefícios

### ✅ Vantagens
- **Centralização**: Todas as configs em um lugar
- **Tipagem**: TypeScript para configurações
- **Manutenibilidade**: Fácil de alterar
- **Reutilização**: Configs compartilhadas
- **Organização**: Estrutura clara

### 🔧 Flexibilidade
- Configurações por ambiente
- Valores padrão
- Validação de configurações
- Override de configurações

## 📊 Estrutura de Configurações

### API
```typescript
api: {
  baseURL: string
  timeout: number
}
```

### Autenticação
```typescript
auth: {
  tokenKey: string
  userDataKey: string
}
```

### App
```typescript
app: {
  name: string
  version: string
}
```

## 🔄 Integração

### AuthService
```typescript
import { api } from '@/config/api'

export const authService = {
  getMe: async () => {
    const response = await api.get('/me')
    return response.data
  }
}
```

### StorageService
```typescript
import { config } from '@/config'

const STORAGE_KEYS = {
  AUTH_TOKEN: config.auth.tokenKey,
  USER_DATA: config.auth.userDataKey,
}
```

## 🛠️ Configuração por Ambiente

### Exemplo de Implementação
```typescript
// config/environments.ts
export const environments = {
  development: {
    api: { baseURL: 'http://localhost:3000' }
  },
  production: {
    api: { baseURL: 'https://api.production.com' }
  }
}
```

### Uso
```typescript
// config/index.ts
import { environments } from './environments'

const env = process.env.NODE_ENV || 'development'
export const config = {
  ...environments[env],
  // outras configs
}
```

## 📚 Próximos Passos

### Melhorias Possíveis
1. **Validação**: Validar configurações obrigatórias
2. **Ambientes**: Configurações por ambiente
3. **Secrets**: Gerenciar secrets de forma segura
4. **Hot Reload**: Recarregar configs em desenvolvimento
5. **Documentação**: Auto-documentação das configs

### Exemplo de Validação
```typescript
// config/validation.ts
export const validateConfig = (config: AppConfig) => {
  if (!config.api.baseURL) {
    throw new Error('API baseURL is required')
  }
  // outras validações
}
```

## 🎯 Boas Práticas

### ✅ Recomendado
- Centralizar configurações
- Usar TypeScript para tipagem
- Documentar configurações
- Validar configurações obrigatórias
- Usar constantes para valores fixos

### ❌ Evite
- Hardcoded values
- Configurações espalhadas
- Configurações sensíveis no código
- Configurações sem tipagem
- Configurações sem documentação 