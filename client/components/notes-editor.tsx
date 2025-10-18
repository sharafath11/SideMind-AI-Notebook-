"use client"

import { useState, useEffect } from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { AppState, Note } from "@/lib/types"

interface NotesEditorProps {
  state: AppState
  onAddHeading: (subjectId: string, chapterId: string, title: string) => void
  onAddNote: (subjectId: string, chapterId: string, headingId: string, heading: string, content: string) => void
  onUpdateNote: (
    subjectId: string,
    chapterId: string,
    headingId: string,
    noteId: string,
    updates: Partial<Note>,
  ) => void
  onSelectNote: (subjectId: string, chapterId: string, headingId: string, noteId: string) => void
}

export function NotesEditor({ state, onAddHeading, onAddNote, onUpdateNote, onSelectNote }: NotesEditorProps) {
  const [newHeadingTitle, setNewHeadingTitle] = useState("")
  const [newNoteHeading, setNewNoteHeading] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const currentSubject = state.subjects.find((s) => s.id === state.currentSubjectId)
  const currentChapter = currentSubject?.chapters.find((c) => c.id === state.currentChapterId)
  const currentNote = currentChapter?.headings.flatMap((h) => h.notes).find((n) => n.id === state.currentNoteId)

  useEffect(() => {
    if (currentNote && editingNoteId === currentNote.id) {
      setEditingContent(currentNote.content)
    }
  }, [currentNote, editingNoteId])

  if (!currentChapter) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Select a chapter to start taking notes</p>
        </div>
      </div>
    )
  }

  const handleAddHeading = () => {
    if (newHeadingTitle.trim() && state.currentSubjectId && state.currentChapterId) {
      onAddHeading(state.currentSubjectId, state.currentChapterId, newHeadingTitle)
      setNewHeadingTitle("")
    }
  }

  const handleAddNote = (headingId: string) => {
    if (newNoteHeading.trim() && newNoteContent.trim() && state.currentSubjectId && state.currentChapterId) {
      onAddNote(state.currentSubjectId, state.currentChapterId, headingId, newNoteHeading, newNoteContent)
      setNewNoteHeading("")
      setNewNoteContent("")
    }
  }

  const handleSaveEdit = (headingId: string, noteId: string) => {
    if (state.currentSubjectId && state.currentChapterId) {
      onUpdateNote(state.currentSubjectId, state.currentChapterId, headingId, noteId, {
        content: editingContent,
        updatedAt: new Date(),
      })
      setEditingNoteId(null)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{currentChapter.title}</h2>
          <p className="text-muted-foreground">{currentChapter.headings.length} sections</p>
        </div>

        <div className="mb-8 p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-3">Add New Section</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Section title..."
              value={newHeadingTitle}
              onChange={(e) => setNewHeadingTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddHeading()}
            />
            <Button onClick={handleAddHeading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {currentChapter.headings.map((heading) => (
            <Card key={heading.id} className="p-6 bg-card border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">{heading.title}</h3>

              <div className="space-y-4 mb-6">
                {heading.notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      state.currentNoteId === note.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => onSelectNote(state.currentSubjectId!, state.currentChapterId!, heading.id, note.id)}
                  >
                    {editingNoteId === note.id ? (
                      <div className="space-y-3">
                        <Input value={note.heading} disabled className="font-semibold" />
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full p-3 rounded border border-border bg-background text-foreground min-h-32 resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(heading.id, note.id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingNoteId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{note.heading}</h4>
                        <p className="text-foreground/80 whitespace-pre-wrap mb-3">{note.content}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingNoteId(note.id)
                            }}
                            className="text-primary hover:bg-primary/10"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">Add Note</h4>
                <Input
                  placeholder="Note title..."
                  value={newNoteHeading}
                  onChange={(e) => setNewNoteHeading(e.target.value)}
                  className="mb-3"
                />
                <textarea
                  placeholder="Write your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-3 rounded border border-border bg-background text-foreground min-h-24 resize-none mb-3"
                />
                <Button
                  onClick={() => handleAddNote(heading.id)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
