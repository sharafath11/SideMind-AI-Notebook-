"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditableModalProps } from "@/types/propsTypes";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";



export const EditableModal = ({
  isOpen,
  title,
  initialValues = { name: "", description: "" },
  nameLabel = "Title",
  descriptionLabel = "Description",
  onSave,
  onClose,
}: EditableModalProps) => {
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");

  useEffect(() => {
    setName(initialValues.name || "");
    setDescription(initialValues.description || "");
  }, [initialValues]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div>
            <label className="text-sm text-muted-foreground">{nameLabel}</label>
            <Input
              placeholder="Enter title"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{descriptionLabel}</label>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-primary text-white">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
