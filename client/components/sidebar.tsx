"use client"

import { useState } from "react"
import { ChevronDown, Plus, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AppState } from "@/lib/types"

interface SidebarProps {
  state: AppState
  onAddSubject: (title: string, description: string) => void
  onDeleteSubject: (id: string) => void
  onAddChapter: (subjectId: string, title: string) => void
  onDeleteChapter: (subjectId: string, chapterId: string) => void
  onSelectSubject: (subjectId: string) => void
  onSelectChapter: (subjectId: string, chapterId: string) => void
}

export function Sidebar({
  state,
  onAddSubject,
  onDeleteSubject,
  onAddChapter,
  onDeleteChapter,
  onSelectSubject,
  onSelectChapter,
}: SidebarProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [newSubjectTitle, setNewSubjectTitle] = useState("")
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [activeSubjectForChapter, setActiveSubjectForChapter] = useState<string | null>(null)

  const toggleSubject = (id: string) => {
    const newExpanded = new Set(expandedSubjects)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSubjects(newExpanded)
  }

  const handleAddSubject = () => {
    if (newSubjectTitle.trim()) {
      onAddSubject(newSubjectTitle, "")
      setNewSubjectTitle("")
    }
  }

  const handleAddChapter = (subjectId: string) => {
    if (newChapterTitle.trim()) {
      onAddChapter(subjectId, newChapterTitle)
      setNewChapterTitle("")
      setActiveSubjectForChapter(null)
    }
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" />
          AI Notes
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="New subject..."
            value={newSubjectTitle}
            onChange={(e) => setNewSubjectTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleAddSubject}
            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {state.subjects.map((subject) => (
          <div key={subject.id} className="border-b border-sidebar-border">
            <div
              className={`flex items-center justify-between p-3 hover:bg-sidebar-accent cursor-pointer transition-colors ${
                state.currentSubjectId === subject.id ? "bg-sidebar-accent" : ""
              }`}
              onClick={() => {
                onSelectSubject(subject.id)
                toggleSubject(subject.id)
              }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    expandedSubjects.has(subject.id) ? "" : "-rotate-90"
                  }`}
                />
                <span className="text-sm font-medium text-sidebar-foreground truncate">{subject.title}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSubject(subject.id)
                }}
                className="h-6 w-6 p-0 text-sidebar-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {expandedSubjects.has(subject.id) && (
              <div className="bg-sidebar/50 pl-4">
                {subject.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className={`flex items-center justify-between p-2 hover:bg-sidebar-accent/50 cursor-pointer transition-colors text-sm ${
                      state.currentChapterId === chapter.id ? "bg-sidebar-accent/50" : ""
                    }`}
                    onClick={() => onSelectChapter(subject.id, chapter.id)}
                  >
                    <span className="text-sidebar-foreground truncate">{chapter.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChapter(subject.id, chapter.id)
                      }}
                      className="h-5 w-5 p-0 text-sidebar-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}

                {activeSubjectForChapter === subject.id ? (
                  <div className="flex gap-2 p-2">
                    <Input
                      placeholder="Chapter name..."
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddChapter(subject.id)}
                      className="text-xs h-8"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddChapter(subject.id)}
                      className="h-8 px-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveSubjectForChapter(subject.id)}
                    className="w-full justify-start text-xs text-sidebar-foreground hover:bg-sidebar-accent/50 h-8"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Chapter
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
