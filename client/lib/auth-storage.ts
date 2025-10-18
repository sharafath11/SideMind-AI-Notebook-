const AUTH_KEY = "ai_notes_auth"

export interface StoredUser {
  id: string
  email: string
  name: string
  password?: string
  createdAt: string
}

export const authStorage = {
  getUsers: (): StoredUser[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(AUTH_KEY)
    return data ? JSON.parse(data) : []
  },

  saveUser: (user: StoredUser) => {
    if (typeof window === "undefined") return
    const users = authStorage.getUsers()
    const existingIndex = users.findIndex((u) => u.email === user.email)
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(users))
  },

  findUserByEmail: (email: string): StoredUser | undefined => {
    const users = authStorage.getUsers()
    return users.find((u) => u.email === email)
  },

  verifyPassword: (email: string, password: string): boolean => {
    const user = authStorage.findUserByEmail(email)
    return user ? user.password === password : false
  },

  getCurrentUser: (): StoredUser | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem("ai_notes_current_user")
    return data ? JSON.parse(data) : null
  },

  setCurrentUser: (user: StoredUser | null) => {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem("ai_notes_current_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("ai_notes_current_user")
    }
  },

  logout: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("ai_notes_current_user")
  },
}
