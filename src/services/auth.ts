import axios from "axios"

const API_URL = "http://localhost:3000"

export interface LoginResponse {
  access_token: string
  user: {
    id: number
    email: string
    name: string
    role: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface UserData {
  id: number
  email: string
  name: string
  role: string
}

class AuthService {
  private token: string | null = null
  private userData: UserData | null = null

  constructor() {
    // Recupera o token e dados do usuário do localStorage ao inicializar
    this.token = localStorage.getItem("token")
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData)
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        credentials
      )
      const { access_token, user } = response.data

      // Salva o token e dados do usuário no localStorage
      localStorage.setItem("token", access_token)
      localStorage.setItem("userData", JSON.stringify(user))

      this.token = access_token
      this.userData = user

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed")
      }
      throw error
    }
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    this.token = null
    this.userData = null
  }

  getToken(): string | null {
    return this.token
  }

  getUserData(): UserData | null {
    return this.userData
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  // Configura o token no header das requisições
  getAuthHeader(): { Authorization: string } | Record<string, never> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {}
  }
}

export const authService = new AuthService()
