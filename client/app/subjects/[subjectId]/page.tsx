"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Plus, ChevronLeft, Trash2, BookMarked, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { storage } from "@/lib/storage"
import type { Subject, Chapter } from "@/lib/types"

export default function ChaptersPage() {
  const params = useParams()
  const subjectId = params.subjectId as string
  const [subject, setSubject] = useState<Subject | null>(null)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date" | "sections">("name")

  useEffect(() => {
    const state = storage.getState()
    const foundSubject = state.subjects.find((s) => s.id === subjectId)
    setSubject(foundSubject || null)
  }, [subjectId])

  const handleAddChapter = () => {
    if (newChapterTitle.trim() && subject) {
      const chapter: Chapter = {
        id: Date.now().toString(),
        title: newChapterTitle,
        headings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      storage.addChapter(subject.id, chapter)
      const state = storage.getState()
      const updatedSubject = state.subjects.find((s) => s.id === subjectId)
      setSubject(updatedSubject || null)
      setNewChapterTitle("")
    }
  }

  const handleDeleteChapter = (chapterId: string) => {
    if (subject) {
      storage.deleteChapter(subject.id, chapterId)
      const state = storage.getState()
      const updatedSubject = state.subjects.find((s) => s.id === subjectId)
      setSubject(updatedSubject || null)
    }
  }

  const filteredAndSortedChapters = (subject?.chapters || [])
    .filter((chapter) => chapter.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "sections") {
        return b.headings.length - a.headings.length
      }
      return 0
    })

  if (!subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Subject not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </Button>
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">{subject.title}</h1>
          </div>
          {subject.description && <p className="text-muted-foreground">{subject.description}</p>}
        </div>

        <Card className="p-6 bg-card border-border mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Add New Chapter</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Chapter title (e.g., Introduction, Chapter 1)..."
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddChapter()}
              className="text-base"
            />
            <Button onClick={handleAddChapter} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </Card>

        <div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Chapters</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "date" | "sections")}
                className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="sections">Sort by Sections</option>
              </select>
            </div>
          </div>

          {filteredAndSortedChapters.length === 0 ? (
            <Card className="p-12 bg-card border-border text-center">
              <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {subject.chapters.length === 0
                  ? "No chapters yet. Create one to start taking notes!"
                  : "No chapters match your search."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAndSortedChapters.map((chapter) => (
                <Link key={chapter.id} href={`/subjects/${subject.id}/chapters/${chapter.id}`}>
                  <Card className="p-6 bg-card border-border hover:border-primary/50 cursor-pointer transition-all h-full hover:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <BookMarked className="w-6 h-6 text-primary" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDeleteChapter(chapter.id)
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{chapter.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {chapter.headings.length} section{chapter.headings.length !== 1 ? "s" : ""}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
