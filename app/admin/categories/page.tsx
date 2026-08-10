"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { Category } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
  { href: "/admin/categories", label: "Categories" },
];

function resolveId(category: Category): string {
  return category.id ?? category._id ?? "";
}

/**
 * Mirrors the backend Zod rules in categories.validation.ts:
 * name 2-50 chars, description optional and max 255 chars.
 */
function validateCategoryForm(name: string, description: string): string | null {
  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return "Category name must be at least 2 characters.";
  }

  if (trimmedName.length > 50) {
    return "Category name cannot exceed 50 characters.";
  }

  if (description.trim().length > 255) {
    return "Description cannot exceed 255 characters.";
  }

  return null;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const nextCategories = await getAdminCategories();
        setCategories(Array.isArray(nextCategories) ? nextCategories : []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  function openCreateDialog() {
    setEditing(null);
    setName("");
    setDescription("");
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditing(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setFormError(null);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateCategoryForm(name, description);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      name: name.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
    };

    setSubmitting(true);
    setFormError(null);
    try {
      if (editing) {
        const editedId = resolveId(editing);
        const updated = await updateAdminCategory(editedId, payload);
        setCategories((prev) =>
          prev.map((item) => (resolveId(item) === editedId ? { ...item, ...updated } : item)),
        );
        toast.success("Category updated.");
      } else {
        const created = await createAdminCategory(payload);
        setCategories((prev) => [created, ...prev]);
        toast.success("Category created.");
      }
      closeDialog();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    try {
      await deleteAdminCategory(id);
      setCategories((prev) => prev.filter((item) => resolveId(item) !== id));
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category.");
    } finally {
      setPendingId(null);
    }
  }

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Categories</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Manage categories</h1>
        </div>
        <Button variant="default" onClick={openCreateDialog}>
          <Plus /> Add category
        </Button>
      </div>

      {loading && categories.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 w-full">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : !loading && !categories.length ? (
        <EmptyState
          title="No categories found"
          description="Create your first category to organize gear listings."
        />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
            { key: "actions", label: "Actions" },
          ]}
          data={categories.map((item) => ({
            ...item,
            name: item.name,
            description: item.description ?? "—",
            actions: (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                  disabled={pendingId === resolveId(item)}
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      disabled={pendingId === resolveId(item)}
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete category?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove &quot;{item.name}&quot;. Categories still referenced by gear
                        cannot be deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(resolveId(item))}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {pendingId === resolveId(item) ? "Deleting…" : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ),
          }))}
        />
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
            <DialogDescription>
              {editing ? `Update "${editing.name}".` : "Create a new category to organize gear listings."}
            </DialogDescription>
          </DialogHeader>
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Camping"
                maxLength={50}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional — what kinds of gear belong here?"
                maxLength={255}
              />
            </div>
            {formError ? (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>
            ) : null}
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" form="category-form" disabled={submitting}>
              {submitting
                ? editing
                  ? "Saving…"
                  : "Creating…"
                : editing
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

