import axios from "axios"
import { authService } from "@/services/auth"

export const api = axios.create({
  baseURL: "http://localhost:3000",
})

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = authService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepta erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      authService.logout()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
