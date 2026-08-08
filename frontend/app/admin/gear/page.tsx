"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { deleteAdminGear, getAdminGear } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { Gear } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];


export default function AdminGearPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [gear, setGear] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

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
        const nextGear = await getAdminGear();
        setGear(Array.isArray(nextGear) ? nextGear : []);
      } catch {
        setGear([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  async function handleDelete(id: string) {
    setPendingId(id);
    try {
      await deleteAdminGear(id);
      setGear((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      toast.success("Gear deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete gear.");
    } finally {
      setPendingId(null);
    }
  }

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Gear</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Moderation queue</h1>
      </div>

      {loading && gear.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 w-full">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : !loading && !gear.length ? (
        <EmptyState title="No gear found" description="There is no gear data to review right now." />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Gear" },
            { key: "provider", label: "Provider" },
            { key: "condition", label: "Condition" },
            { key: "actions", label: "Actions" },
          ]}
          data={gear.map((item) => ({
            ...item,
            provider: typeof item.provider === "object" && item.provider !== null
              ? (item.provider as { name?: string }).name || "Unassigned"
              : item.provider || "Unassigned",
            condition: item.condition ?? "Pending",
            actions: (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                    disabled={pendingId === item.id || pendingId === item._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete gear?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove "{item.name}" from the catalog. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(item.id ?? item._id ?? "")}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {pendingId === item.id || pendingId === item._id ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ),
          }))}
        />
      )}
    </DashboardShell>
  );
}
