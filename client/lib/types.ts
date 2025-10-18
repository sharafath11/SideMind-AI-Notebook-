export interface Note {
  id: string
  heading: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Heading {
  id: string
  title: string
  notes: Note[]
}

export interface Chapter {
  id: string
  title: string
  headings: Heading[]
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  id: string
  title: string
  description: string
  chapters: Chapter[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface AppState {
  subjects: Subject[]
  currentSubjectId: string | null
  currentChapterId: string | null
  currentHeadingId: string | null
  currentNoteId: string | null
}
