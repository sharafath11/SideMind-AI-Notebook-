"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, Plus, Save, Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { storage } from "@/lib/storage"
import { AIAssistant } from "@/components/ai-assistant"
import type { Subject, Chapter } from "@/lib/types"

export default function NotesPage() {
  const params = useParams()
  const subjectId = params.subjectId as string
  const chapterId = params.chapterId as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [newHeadingTitle, setNewHeadingTitle] = useState("")
  const [newNoteHeading, setNewNoteHeading] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date" | "notes">("name")

  useEffect(() => {
    const state = storage.getState()
    const foundSubject = state.subjects.find((s) => s.id === subjectId)
    const foundChapter = foundSubject?.chapters.find((c) => c.id === chapterId)
    setSubject(foundSubject || null)
    setChapter(foundChapter || null)
  }, [subjectId, chapterId])

  const handleAddHeading = () => {
    if (newHeadingTitle.trim() && subject && chapter) {
      storage.addHeading(subject.id, chapter.id, newHeadingTitle)
      const state = storage.getState()
      const updatedSubject = state.subjects.find((s) => s.id === subjectId)
      const updatedChapter = updatedSubject?.chapters.find((c) => c.id === chapterId)
      setChapter(updatedChapter || null)
      setNewHeadingTitle("")
    }
  }

  const handleAddNote = (headingId: string) => {
    if (newNoteHeading.trim() && newNoteContent.trim() && subject && chapter) {
      storage.addNote(subject.id, chapter.id, headingId, {
        id: Date.now().toString(),
        heading: newNoteHeading,
        content: newNoteContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const state = storage.getState()
      const updatedSubject = state.subjects.find((s) => s.id === subjectId)
      const updatedChapter = updatedSubject?.chapters.find((c) => c.id === chapterId)
      setChapter(updatedChapter || null)
      setNewNoteHeading("")
      setNewNoteContent("")
    }
  }

  const handleSaveEdit = (headingId: string, noteId: string) => {
    if (subject && chapter) {
      storage.updateNote(subject.id, chapter.id, headingId, noteId, {
        content: editingContent,
        updatedAt: new Date(),
      })
      const state = storage.getState()
      const updatedSubject = state.subjects.find((s) => s.id === subjectId)
      const updatedChapter = updatedSubject?.chapters.find((c) => c.id === chapterId)
      setChapter(updatedChapter || null)
      setEditingNoteId(null)
    }
  }

  const handleDeleteNote = (headingId: string, noteId: string) => {
    if (subject && chapter) {
      const heading = chapter.headings.find((h) => h.id === headingId)
      if (heading) {
        heading.notes = heading.notes.filter((n) => n.id !== noteId)
        storage.updateChapter(subject.id, chapter.id, chapter)
        const state = storage.getState()
        const updatedSubject = state.subjects.find((s) => s.id === subjectId)
        const updatedChapter = updatedSubject?.chapters.find((c) => c.id === chapterId)
        setChapter(updatedChapter || null)
        if (selectedNoteId === noteId) setSelectedNoteId(null)
      }
    }
  }

  const filteredAndSortedHeadings = (chapter?.headings || [])
    .filter(
      (heading) =>
        heading.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        heading.notes.some(
          (note) =>
            note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "date") {
        const aLatest = Math.max(...a.notes.map((n) => new Date(n.createdAt).getTime()), 0)
        const bLatest = Math.max(...b.notes.map((n) => new Date(n.createdAt).getTime()), 0)
        return bLatest - aLatest
      } else if (sortBy === "notes") {
        return b.notes.length - a.notes.length
      }
      return 0
    })

  const currentNote = chapter?.headings.flatMap((h) => h.notes).find((n) => n.id === selectedNoteId)

  if (!subject || !chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chapter not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href={`/subjects/${subjectId}`}>
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{chapter.title}</h1>
            <p className="text-muted-foreground">{subject.title}</p>
          </div>

          <Card className="p-6 bg-card border-border mb-8">
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
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sections and notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "date" | "notes")}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="notes">Sort by Notes Count</option>
            </select>
          </div>

          <div className="space-y-6">
            {filteredAndSortedHeadings.length === 0 ? (
              <Card className="p-12 bg-card border-border text-center">
                <p className="text-muted-foreground">
                  {chapter.headings.length === 0
                    ? "No sections yet. Create one to start taking notes!"
                    : "No sections match your search."}
                </p>
              </Card>
            ) : (
              filteredAndSortedHeadings.map((heading) => (
                <Card key={heading.id} className="p-6 bg-card border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-4">{heading.title}</h3>

                  <div className="space-y-4 mb-6">
                    {heading.notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedNoteId === note.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedNoteId(note.id)}
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
                                  setEditingContent(note.content)
                                }}
                                className="text-primary hover:bg-primary/10"
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteNote(heading.id, note.id)
                                }}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3 h-3" />
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
              ))
            )}
          </div>
        </div>
      </div>

      <AIAssistant currentNote={currentNote} currentChapter={chapter} />
    </div>
  )
}
