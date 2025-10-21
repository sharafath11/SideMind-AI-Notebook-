"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { showInfoToast } from "@/components/shared/toast";

import { getSession, signOut,  } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { authService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";
import { IUser } from "@/types/userTypes";
import { PageHeader } from "@/components/shared/Header";

type Subject = {
  id: string;
  title: string;
  description: string;
  chapters: string[];
  createdAt: Date;
  updatedAt: Date;
};

function SubjectsPageContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const dispatch = useDispatch()
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "chapters">("name");
  const [userDet,setUserDet] =useState<IUser>()
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
        const session: Session | null = await getSession();
        if (!session?.user) {
            showInfoToast("Please Login");
            router.push("/")
        }
      if (session?.user) {
        const res = await authService.fetchToken(
          session.user.id,
          session?.user?.email ?? '',
          session.user.name ?? ""
        );
        if (!res.ok) {
          showInfoToast(res.msg);
          router.push("/")
        }
          setUserDet({ name: res.data.name, email: res.data.email, userId: res.data.userId })
          if(userDet)dispatch(setUser(userDet))
      }
    }
    
    fetchToken();
  }, []);

  const handleAddSubject = () => {
    if (!newSubjectTitle.trim()) return;

    const subject: Subject = {
      id: Date.now().toString(),
      title: newSubjectTitle,
      description: newSubjectDescription,
      chapters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSubjects((prev) => [...prev, subject]);
    setNewSubjectTitle("");
    setNewSubjectDescription("");
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  

  const filteredAndSortedSubjects = subjects
    .filter(
      (subject) =>
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "date") return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === "chapters") return b.chapters.length - a.chapters.length;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader userDet={userDet||null}  />
        <Card className="p-6 bg-card border-border mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Create New Subject</h2>
          <div className="space-y-3">
            <Input
              placeholder="Subject title (e.g., Biology, History)..."
              value={newSubjectTitle}
              onChange={(e) => setNewSubjectTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
              className="text-base"
            />
            <Input
              placeholder="Description (optional)..."
              value={newSubjectDescription}
              onChange={(e) => setNewSubjectDescription(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
              className="text-base"
            />
            <Button
              onClick={handleAddSubject}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Subject
            </Button>
          </div>
        </Card>
        <div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Subjects</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "date" | "chapters")}
                className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="chapters">Sort by Chapters</option>
              </select>
            </div>
          </div>

          {filteredAndSortedSubjects.length === 0 ? (
            <Card className="p-12 bg-card border-border text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {subjects.length === 0 ? "No subjects yet. Create one to get started!" : "No subjects match your search."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-6 bg-card border-border hover:border-primary/50 cursor-pointer transition-all h-full hover:shadow-lg rounded-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{subject.title}</h3>
                  {subject.description && <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    {subject.chapters.length} chapter{subject.chapters.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  return <SubjectsPageContent />;
}