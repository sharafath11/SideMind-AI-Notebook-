"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { showInfoToast, showSuccessToast } from "@/components/shared/toast";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/userSlice";
import { fetchSubjects, addSubject, deleteSubject, editSubject } from "@/store/subjectSlice";
import { PageHeader } from "@/components/shared/Header";
import { SearchSortPaginateBar } from "@/components/shared/SearchSortPaginateBar";
import { IUser } from "@/types/userTypes";
import { Session } from "next-auth";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { CustomConfirmation } from "@/components/shared/custom-confirmation";
import { EditableModal } from "@/components/shared/EditableModal";

export default function SubjectsPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { subjects, loading, totalPages } = useSelector((state: RootState) => state.subjects);
  const [userDet, setUserDet] = useState<IUser>();
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "chapters">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<{ id: string; title: string; description?: string } | null>(null);
  const itemsPerPage = 5;
  const debouncedSearch = useDebouncedSearch({ value: searchQuery, delay: 500 });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndSubjects = async () => {
      const session: Session | null = await getSession();
      if (!session?.user) {
        showInfoToast("Please login");
        return router.push("/");
      }
      setUserDet({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        userId: session.user.id,
      });
      dispatch(
        fetchSubjects({
          search: debouncedSearch,
          sortBy,
          page: currentPage,
          limit: itemsPerPage,
        })
      );
      dispatch(setUser(session.user as unknown as IUser));
    };
    fetchTokenAndSubjects();
  }, [dispatch, router]);

  useEffect(() => {
    dispatch(
      fetchSubjects({
        search: debouncedSearch,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [debouncedSearch, sortBy, currentPage, itemsPerPage, dispatch]);

  const handleAddSubject = async () => {
    if (!newSubjectTitle.trim()) return;
    await dispatch(addSubject({ title: newSubjectTitle, description: newSubjectDescription }));
    setNewSubjectTitle("");
    setNewSubjectDescription("");
    showSuccessToast("Subject added!");
    dispatch(fetchSubjects({ search: debouncedSearch, sortBy, page: currentPage, limit: itemsPerPage }));
  };

  const handleDeleteClick = (id: string) => {
    setSubjectToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    await dispatch(deleteSubject(subjectToDelete));
    showSuccessToast("Subject deleted!");
    setConfirmOpen(false);
    setSubjectToDelete(null);
    dispatch(fetchSubjects({ search: debouncedSearch, sortBy, page: currentPage, limit: itemsPerPage }));
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setSubjectToDelete(null);
  };

  const handleEditClick = (subject: { subId: string; title: string; description?: string }) => {
    setSubjectToEdit({ id: subject.subId, title: subject.title, description: subject.description });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (values: { name: string; description: string }) => {
    if (!subjectToEdit) return;
    await dispatch(editSubject({ id: subjectToEdit.id, title: values.name, description: values.description }));
    showSuccessToast("Subject updated!");
    setEditModalOpen(false);
    dispatch(fetchSubjects({ search: debouncedSearch, sortBy, page: currentPage, limit: itemsPerPage }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader />
        <Card className="p-6 bg-card border-border mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Create New Subject</h2>
          <div className="space-y-3">
            <Input placeholder="Subject title..." value={newSubjectTitle} onChange={(e) => setNewSubjectTitle(e.target.value)} />
            <Input placeholder="Description..." value={newSubjectDescription} onChange={(e) => setNewSubjectDescription(e.target.value)} />
            <Button onClick={handleAddSubject} className="w-full bg-primary text-white">
              <Plus className="w-4 h-4 mr-2" />Add Subject
            </Button>
          </div>
        </Card>

        <SearchSortPaginateBar<"name" | "date" | "chapters">
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOptions={[
            { value: "name", label: "Sort by Name" },
            { value: "date", label: "Sort by Date" },
            { value: "chapters", label: "Sort by Chapters" },
          ]}
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onPageChange={setCurrentPage}
        />

        {loading ? (
          <p className="text-center mt-6">Loading...</p>
        ) : subjects.length === 0 ? (
          <Card className="p-12 bg-card text-center mt-6">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No subjects found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {subjects.map((subject) => (
              <Card key={subject.subId} className="p-6 bg-card border-border rounded-md hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditClick(subject)} className="h-6 w-6 p-0 text-muted-foreground hover:text-primary">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(subject.subId)} className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{subject.title}</h3>
                {subject.description && <p className="text-sm text-muted-foreground mt-2">{subject.description}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>

      <EditableModal
        isOpen={editModalOpen}
        title="Edit Subject"
        initialValues={{ name: subjectToEdit?.title || "", description: subjectToEdit?.description || "" }}
        onSave={handleSaveEdit}
        onClose={() => setEditModalOpen(false)}
      />

      <CustomConfirmation
        variant="danger"
        title="Delete Subject?"
        description="Are you sure you want to permanently delete this subject? This action cannot be undone."
        isOpen={confirmOpen}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
