import { User } from "@/types/user"

const MOCK_USER: User = {
  id: "1",
  email: "admin@habitflow.com",
  name: "Admin Silva",
  role: "admin",
  createdAt: new Date(),
  preferences: {
    notifications: true,
    theme: "light",
    language: "pt-BR",
  },
}

export const mockAuth = {
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      if (email === "admin@habitflow.com" && password === "123456") {
        localStorage.setItem("mockUser", JSON.stringify(MOCK_USER))
        resolve(MOCK_USER)
      } else {
        reject(new Error("Invalid credentials"))
      }
    })
  },

  logout: () => {
    localStorage.removeItem("mockUser")
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("mockUser")
    return user ? JSON.parse(user) : null
  },
}
