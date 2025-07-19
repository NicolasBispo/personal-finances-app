import { StorageService } from "@/services/storageService";
import { useEffect, useState } from "react";

export function useAuthToken(){
  const [token, setToken] = useState<string | null>(null)
  const [loadingToken, setLoadingToken] = useState(true)

  useEffect(() => {
    async function loadToken(){
      try {
        const token = await StorageService.getToken()
        setToken(token)
      } catch (error) {
        console.error('Error loading token:', error)
        setToken(null)
      } finally {
        setLoadingToken(false)
      }
    }
    loadToken()
  }, [])

  // Função para atualizar o token (útil para quando o token é limpo externamente)
  const updateToken = (newToken: string | null) => {
    setToken(newToken)
  }

  return {
    token,
    isLoadingToken: loadingToken,
    updateToken,
  }
}