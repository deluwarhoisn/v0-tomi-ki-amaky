"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "worker" | "buyer" | "admin"

export interface User {
  _id: string
  name: string
  email: string
  photoURL: string
  role: UserRole
  coin: number
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  updateUserCoin: (newCoin: number) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  photoURL: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem("taskflow_token")
    const savedUser = localStorage.getItem("taskflow_user")

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("taskflow_token")
        localStorage.removeItem("taskflow_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // This will be replaced with actual API call to your MongoDB backend
    // For now, simulating with mock data
    const mockUser: User = {
      _id: "1",
      name: email.split("@")[0],
      email,
      photoURL: "/diverse-user-avatars.png",
      role: "worker",
      coin: 10,
      createdAt: new Date().toISOString(),
    }

    const token = "mock_jwt_token_" + Date.now()
    localStorage.setItem("taskflow_token", token)
    localStorage.setItem("taskflow_user", JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const register = async (data: RegisterData) => {
    // Initial coins based on role
    const initialCoins = data.role === "buyer" ? 50 : 10

    const newUser: User = {
      _id: Date.now().toString(),
      name: data.name,
      email: data.email,
      photoURL: data.photoURL || "/diverse-user-avatars.png",
      role: data.role,
      coin: initialCoins,
      createdAt: new Date().toISOString(),
    }

    const token = "mock_jwt_token_" + Date.now()
    localStorage.setItem("taskflow_token", token)
    localStorage.setItem("taskflow_user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const loginWithGoogle = async () => {
    // Simulated Google login
    const mockUser: User = {
      _id: Date.now().toString(),
      name: "Google User",
      email: "googleuser@gmail.com",
      photoURL: "/google-user-avatar.png",
      role: "worker",
      coin: 10,
      createdAt: new Date().toISOString(),
    }

    const token = "mock_jwt_token_google_" + Date.now()
    localStorage.setItem("taskflow_token", token)
    localStorage.setItem("taskflow_user", JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem("taskflow_token")
    localStorage.removeItem("taskflow_user")
    setUser(null)
  }

  const updateUserCoin = (newCoin: number) => {
    if (user) {
      const updatedUser = { ...user, coin: newCoin }
      localStorage.setItem("taskflow_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUserCoin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
