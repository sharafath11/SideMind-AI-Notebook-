"use client"

import { useState, useEffect, useCallback } from "react"
import type { AppState, Subject, Chapter, Heading, Note } from "@/lib/types"
import { storage } from "@/lib/storage"

export function useAppState() {
  const [state, setState] = useState<AppState>({
    subjects: [],
    currentSubjectId: null,
    currentChapterId: null,
    currentHeadingId: null,
    currentNoteId: null,
  })

  useEffect(() => {
    setState(storage.getState())
  }, [])

  const addSubject = useCallback((title: string, description: string) => {
    const subject: Subject = {
      id: Date.now().toString(),
      title,
      description,
      chapters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    storage.addSubject(subject)
    setState(storage.getState())
  }, [])

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    storage.updateSubject(id, updates)
    setState(storage.getState())
  }, [])

  const deleteSubject = useCallback((id: string) => {
    storage.deleteSubject(id)
    setState(storage.getState())
  }, [])

  const addChapter = useCallback((subjectId: string, title: string) => {
    const chapter: Chapter = {
      id: Date.now().toString(),
      title,
      headings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    storage.addChapter(subjectId, chapter)
    setState(storage.getState())
  }, [])

  const updateChapter = useCallback((subjectId: string, chapterId: string, updates: Partial<Chapter>) => {
    storage.updateChapter(subjectId, chapterId, updates)
    setState(storage.getState())
  }, [])

  const deleteChapter = useCallback((subjectId: string, chapterId: string) => {
    storage.deleteChapter(subjectId, chapterId)
    setState(storage.getState())
  }, [])

  const addHeading = useCallback((subjectId: string, chapterId: string, title: string) => {
    const heading: Heading = {
      id: Date.now().toString(),
      title,
      notes: [],
    }
    storage.addHeading(subjectId, chapterId, heading)
    setState(storage.getState())
  }, [])

  const addNote = useCallback(
    (subjectId: string, chapterId: string, headingId: string, heading: string, content: string) => {
      const note: Note = {
        id: Date.now().toString(),
        heading,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      storage.addNote(subjectId, chapterId, headingId, note)
      setState(storage.getState())
    },
    [],
  )

  const updateNote = useCallback(
    (subjectId: string, chapterId: string, headingId: string, noteId: string, updates: Partial<Note>) => {
      storage.updateNote(subjectId, chapterId, headingId, noteId, updates)
      setState(storage.getState())
    },
    [],
  )

  const setCurrentSelection = useCallback(
    (
      subjectId: string | null,
      chapterId: string | null = null,
      headingId: string | null = null,
      noteId: string | null = null,
    ) => {
      storage.setCurrentSelection(subjectId, chapterId, headingId, noteId)
      setState(storage.getState())
    },
    [],
  )

  return {
    state,
    addSubject,
    updateSubject,
    deleteSubject,
    addChapter,
    updateChapter,
    deleteChapter,
    addHeading,
    addNote,
    updateNote,
    setCurrentSelection,
  }
}
