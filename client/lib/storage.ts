import type { AppState, Subject, Chapter, Heading, Note } from "./types"

const STORAGE_KEY = "ai-notes-app-state"

export const storage = {
  getState: (): AppState => {
    if (typeof window === "undefined")
      return {
        subjects: [],
        currentSubjectId: null,
        currentChapterId: null,
        currentHeadingId: null,
        currentNoteId: null,
      }
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? JSON.parse(stored)
      : { subjects: [], currentSubjectId: null, currentChapterId: null, currentHeadingId: null, currentNoteId: null }
  },

  setState: (state: AppState) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  addSubject: (subject: Subject) => {
    const state = storage.getState()
    state.subjects.push(subject)
    storage.setState(state)
  },

  updateSubject: (id: string, updates: Partial<Subject>) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === id)
    if (subject) Object.assign(subject, updates)
    storage.setState(state)
  },

  deleteSubject: (id: string) => {
    const state = storage.getState()
    state.subjects = state.subjects.filter((s) => s.id !== id)
    if (state.currentSubjectId === id) state.currentSubjectId = null
    storage.setState(state)
  },

  addChapter: (subjectId: string, chapter: Chapter) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === subjectId)
    if (subject) subject.chapters.push(chapter)
    storage.setState(state)
  },

  updateChapter: (subjectId: string, chapterId: string, updates: Partial<Chapter>) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === subjectId)
    if (subject) {
      const chapter = subject.chapters.find((c) => c.id === chapterId)
      if (chapter) Object.assign(chapter, updates)
    }
    storage.setState(state)
  },

  deleteChapter: (subjectId: string, chapterId: string) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === subjectId)
    if (subject) {
      subject.chapters = subject.chapters.filter((c) => c.id !== chapterId)
    }
    storage.setState(state)
  },

  addHeading: (subjectId: string, chapterId: string, heading: Heading) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === subjectId)
    if (subject) {
      const chapter = subject.chapters.find((c) => c.id === chapterId)
      if (chapter) chapter.headings.push(heading)
    }
    storage.setState(state)
  },

  addNote: (subjectId: string, chapterId: string, headingId: string, note: Note) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === subjectId)
    if (subject) {
      const chapter = subject.chapters.find((c) => c.id === chapterId)
      if (chapter) {
        const heading = chapter.headings.find((h) => h.id === headingId)
        if (heading) heading.notes.push(note)
      }
    }
    storage.setState(state)
  },

  updateNote: (subjectId: string, chapterId: string, headingId: string, noteId: string, updates: Partial<Note>) => {
    const state = storage.getState()
    const subject = state.subjects.find((s) => s.id === subjectId)
    if (subject) {
      const chapter = subject.chapters.find((c) => c.id === chapterId)
      if (chapter) {
        const heading = chapter.headings.find((h) => h.id === headingId)
        if (heading) {
          const note = heading.notes.find((n) => n.id === noteId)
          if (note) Object.assign(note, updates)
        }
      }
    }
    storage.setState(state)
  },

  setCurrentSelection: (
    subjectId: string | null,
    chapterId: string | null = null,
    headingId: string | null = null,
    noteId: string | null = null,
  ) => {
    const state = storage.getState()
    state.currentSubjectId = subjectId
    state.currentChapterId = chapterId
    state.currentHeadingId = headingId
    state.currentNoteId = noteId
    storage.setState(state)
  },
}
