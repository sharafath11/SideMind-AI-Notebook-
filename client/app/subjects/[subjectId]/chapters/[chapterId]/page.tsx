"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Save, Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AIAssistant } from "@/components/ai-assistant"

export default function NotesPage() {
  // --- Mock data (static) ---
  const subject = { id: "1", title: "Biology" }
  const chapter = {
    id: "1",
    title: "Photosynthesis",
    headings: [
      {
        id: "h1",
        title: "Light Reactions",
        notes: [
          {
            id: "n1",
            heading: "Overview of Light Reactions",
            content: "Light reactions occur in the thylakoid membranes and produce ATP and NADPH.",
            updatedAt: new Date(),
          },
          {
            id: "n2",
            heading: "Chlorophyll Function",
            content: "Chlorophyll absorbs light primarily in the blue and red wavelengths.",
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: "h2",
        title: "Calvin Cycle",
        notes: [
          {
            id: "n3",
            heading: "Carbon Fixation",
            content: "The Calvin Cycle uses ATP and NADPH to convert CO₂ into glucose.",
            updatedAt: new Date(),
          },
        ],
      },
    ],
  }

  // --- Dummy state for visual-only interactivity (no backend) ---
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date" | "notes">("name")
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  // Mock filtered data (still static)
  const filteredHeadings = chapter.headings.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentNote = chapter.headings
    .flatMap((h) => h.notes)
    .find((n) => n.id === selectedNoteId)

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back button */}
          <Link href="#">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{chapter.title}</h1>
            <p className="text-muted-foreground">{subject.title}</p>
          </div>

          {/* Add section */}
          <Card className="p-6 bg-card border-border mb-8">
            <h3 className="font-semibold text-foreground mb-3">Add New Section</h3>
            <div className="flex gap-2">
              <Input placeholder="Section title..." />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </Card>

          {/* Search + Sort */}
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

          {/* Headings & Notes */}
          <div className="space-y-6">
            {filteredHeadings.length === 0 ? (
              <Card className="p-12 bg-card border-border text-center">
                <p className="text-muted-foreground">
                  No sections yet. Create one to start taking notes!
                </p>
              </Card>
            ) : (
              filteredHeadings.map((heading) => (
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
                              value={editingContent || note.content}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="w-full p-3 rounded border border-border bg-background text-foreground min-h-32 resize-none"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingNoteId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">{note.heading}</h4>
                            <p className="text-foreground/80 whitespace-pre-wrap mb-3">
                              {note.content}
                            </p>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span>Updated: {note.updatedAt.toLocaleDateString()}</span>
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
                                onClick={(e) => e.stopPropagation()}
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

                  {/* Add Note UI */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-3">Add Note</h4>
                    <Input placeholder="Note title..." className="mb-3" />
                    <textarea
                      placeholder="Write your note here..."
                      className="w-full p-3 rounded border border-border bg-background text-foreground min-h-24 resize-none mb-3"
                    />
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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

      {/* Dummy AI Assistant Sidebar */}
      <AIAssistant currentNote={currentNote} currentChapter={chapter} />
    </div>
  )
}
