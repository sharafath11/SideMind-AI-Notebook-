"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { StoredUser } from "@/lib/auth-storage"

interface AuthContextType {
  user: StoredUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signup: (email: string, password: string, name: string) => Promise<StoredUser>
  login: (email: string, password: string) => Promise<StoredUser>
  loginWithGoogle: (googleUser: { email: string; name: string }) => Promise<StoredUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
