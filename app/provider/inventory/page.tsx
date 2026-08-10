"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { deleteGear, updateGear } from "@/services/gear";
import { getProviderGear, getProviderGearById } from "@/services/provider";
import { useAuthStore } from "@/store/auth-store";
import type { Gear } from "@/types";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];

type EditForm = {
  name: string;
  pricePerDay: string;
  stock: string;
  brand: string;
  description: string;
  image: string;
};

export default function ProviderInventoryPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [inventory, setInventory] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const [detailGear, setDetailGear] = useState<Gear | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editGear, setEditGear] = useState<Gear | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", pricePerDay: "", stock: "", brand: "", description: "", image: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
        const nextGear = await getProviderGear();
        setInventory(Array.isArray(nextGear) ? nextGear : []);
      } catch {
        setInventory([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  async function handleView(id: string) {
    if (!id) {
      return;
    }

    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const gear = await getProviderGearById(id);
      setDetailGear(gear);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load gear details");
      setDetailGear(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function openEdit(gear: Gear) {
    setEditGear(gear);
    setEditForm({
      name: gear.name ?? "",
      pricePerDay: gear.pricePerDay != null ? String(gear.pricePerDay) : "",
      stock: gear.stockQuantity != null ? String(gear.stockQuantity) : gear.stock != null ? String(gear.stock) : "",
      brand: gear.brand ?? "",
      description: gear.description ?? "",
      image: (Array.isArray(gear.images) && gear.images[0]) || gear.image || "",
    });
    setEditError(null);
    setEditOpen(true);
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editGear) {
      return;
    }

    const id = editGear._id ?? editGear.id ?? "";
    if (!id) {
      setEditError("This gear has no id.");
      return;
    }

    const pricePerDay = Number(editForm.pricePerDay);
    const stock = Number(editForm.stock);

    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      setEditError("Enter a valid price per day.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setEditError("Enter a valid stock quantity.");
      return;
    }

    const brand = editForm.brand.trim();
    const description = editForm.description.trim();
    const image = editForm.image.trim();

    if (description && description.length < 10) {
      setEditError("Description must be at least 10 characters.");
      return;
    }

    if (image) {
      try {
        new URL(image);
      } catch {
        setEditError("Image URL must be a valid URL (e.g. https://…).");
        return;
      }
    }

    setEditSaving(true);
    setEditError(null);

    try {
      await updateGear(id, {
        name: editForm.name.trim(),
        pricePerDay,
        stock,
        brand: brand || undefined,
        description: description || undefined,
        imageUrl: image || undefined,
      });
      toast.success("Gear updated");
      setEditOpen(false);
      const nextGear = await getProviderGear();
      setInventory(Array.isArray(nextGear) ? nextGear : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update gear";
      setEditError(message);
      toast.error(message);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!id) {
      return;
    }

    setPendingId(id);
    try {
      await deleteGear(id);
      setInventory((prev) => prev.filter((item) => (item._id ?? item.id) !== id));
      toast.success("Gear deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete gear");
    } finally {
      setPendingId(null);
    }
  }

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Inventory</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Your gear library</h1>
        </div>
        <Button asChild className="rounded-xl bg-pine text-white hover:bg-pine/90">
          <Link href="/provider/add-gear">
            <Plus className="h-4 w-4" />
            Add gear
          </Link>
        </Button>
      </div>

      {loading && inventory.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 w-full">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : null}
      {!loading && !inventory.length ? (
        <EmptyState
          title="No inventory found"
          description="You do not have any gear in inventory yet."
          actionLabel="Add gear"
          href="/provider/add-gear"
        />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Gear" },
            { key: "stock", label: "Stock" },
            { key: "pricePerDay", label: "Price" },
            { key: "condition", label: "Condition" },
            { key: "actions", label: "Actions" },
          ]}
          data={inventory.map((item) => {
            const itemId = item._id ?? item.id ?? "";
            const isPending = pendingId === itemId;
            return {
              ...item,
              stock: item.stockQuantity ?? item.stock ?? 0,
              pricePerDay: item.pricePerDay ? `$${item.pricePerDay}/day` : "—",
              actions: (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg"
                    title="View details"
                    onClick={() => handleView(itemId)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg"
                    title="Edit"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                        title="Delete"
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete gear?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove "{item.name}" from your inventory. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(itemId)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {isPending ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ),
            };
          })}
        />
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailGear?.name ?? "Gear details"}</DialogTitle>
            <DialogDescription>Details from the provider catalog.</DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ) : detailGear ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Price</span>
                <span className="font-mono">
                  {detailGear.pricePerDay != null ? `$${detailGear.pricePerDay}/day` : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Stock</span>
                <span>{detailGear.stockQuantity ?? detailGear.stock ?? 0}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Condition</span>
                <span>{detailGear.condition ?? "—"}</span>
              </div>
              {detailGear.description ? (
                <p className="pt-2 text-muted-foreground">{detailGear.description}</p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load gear details.</p>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit gear</DialogTitle>
            <DialogDescription>Update the details for {editGear?.name ?? "this gear"}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price per day</Label>
              <Input id="edit-price" type="number" min="0" step="0.01" value={editForm.pricePerDay} onChange={(e) => setEditForm({ ...editForm, pricePerDay: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock</Label>
              <Input id="edit-stock" type="number" min="0" step="1" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand">Brand</Label>
              <Input id="edit-brand" placeholder="e.g. Big Agnes" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                rows={3}
                placeholder="Describe condition, included accessories, pickup details…"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input id="edit-image" type="url" placeholder="https://example.com/tent.jpg" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
            </div>
            {editError ? <p role="alert" className="text-sm text-destructive">{editError}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-pine text-white hover:bg-pine/90" disabled={editSaving}>
                {editSaving ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}