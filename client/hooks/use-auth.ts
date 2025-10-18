"use client"

import { useState, useEffect, useCallback } from "react"
import { authStorage, type StoredUser } from "@/lib/auth-storage"

export const useAuth = () => {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authStorage.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const existingUser = authStorage.findUserByEmail(email)
    if (existingUser) {
      throw new Error("Email already registered")
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
    }

    authStorage.saveUser(newUser)
    authStorage.setCurrentUser(newUser)
    setUser(newUser)
    return newUser
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!authStorage.verifyPassword(email, password)) {
      throw new Error("Invalid email or password")
    }

    const user = authStorage.findUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    authStorage.setCurrentUser(user)
    setUser(user)
    return user
  }, [])

  const loginWithGoogle = useCallback(async (googleUser: { email: string; name: string }) => {
    let user = authStorage.findUserByEmail(googleUser.email)

    if (!user) {
      user = {
        id: Date.now().toString(),
        email: googleUser.email,
        name: googleUser.name,
        createdAt: new Date().toISOString(),
      }
      authStorage.saveUser(user)
    }

    authStorage.setCurrentUser(user)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    authStorage.logout()
    setUser(null)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    loginWithGoogle,
    logout,
  }
}
