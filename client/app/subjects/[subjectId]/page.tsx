"use client"

import Link from "next/link"
import { ChevronLeft, Plus, Save, Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// 💡 Dummy UI only — no logic, no functions, no real state
export default function NotesPageDummy() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Link href="#" className="inline-block mb-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>

          {/* Chapter Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Photosynthesis</h1>
            <p className="text-muted-foreground">Biology</p>
          </div>

          {/* Add Section */}
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

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search sections and notes..." className="pl-10" />
            </div>
            <select className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm">
              <option>Sort by Name</option>
              <option>Sort by Date</option>
              <option>Sort by Notes Count</option>
            </select>
          </div>

          {/* Headings with Notes (Dummy Data) */}
          <div className="space-y-6">
            {[1, 2].map((section) => (
              <Card key={section} className="p-6 bg-card border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Section {section}: Light Reactions
                </h3>

                {/* Dummy Notes */}
                {[1, 2].map((note) => (
                  <div
                    key={note}
                    className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all mb-4 cursor-pointer"
                  >
                    <h4 className="font-semibold text-foreground mb-2">Note {note} Heading</h4>
                    <p className="text-foreground/80 whitespace-pre-wrap mb-3">
                      This is the dummy content for note {note}. You can replace this with real text later.
                    </p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Updated: Oct 19, 2025</span>
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

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
            ))}
          </div>
        </div>
      </div>

      {/* Dummy AI Assistant Sidebar */}
      <div className="hidden lg:flex flex-col w-80 border-l border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-3 text-foreground">AI Assistant</h3>
        <p className="text-muted-foreground text-sm mb-4">
          This is a placeholder for your AI assistant component.
        </p>
        <Card className="p-4 bg-background border-border text-sm text-muted-foreground">
          <p>Selected note summary or insights will appear here.</p>
        </Card>
      </div>
    </div>
  )
}
