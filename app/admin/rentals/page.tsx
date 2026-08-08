"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Ban } from "lucide-react";
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
import { cancelAdminRental, getAdminRentals } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { Rental } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];


export default function AdminRentalsPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [rentals, setRentals] = useState<Rental[]>([]);
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
        const nextRentals = await getAdminRentals();
        setRentals(Array.isArray(nextRentals) ? nextRentals : []);
      } catch {
        setRentals([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  async function handleCancel(id: string) {
    setPendingId(id);
    try {
      await cancelAdminRental(id);
      setRentals((prev) =>
        prev.map((rental) =>
          (rental.id ?? rental._id) === id ? { ...rental, status: "CANCELLED" } : rental
        )
      );
      toast.success("Rental cancelled.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel rental.");
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
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Rentals</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Booking activity</h1>
      </div>

      {loading && rentals.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 w-full">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : !loading && !rentals.length ? (
        <EmptyState title="No rentals found" description="There are no rental records to show right now." />
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "gear", label: "Item" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
          data={rentals.map((rental: any) => {
            const rentalId = rental.id ?? rental._id ?? "";
            const isCancelled = rental.status === "CANCELLED" || rental.status === "CANCELED";
            return {
              ...rental,
              id: rentalId || "unknown",
              gear: rental.items?.[0]?.gearItem?.name ?? rental.gear?.name ?? "Rental item",
              total: rental.totalAmount ? `$${rental.totalAmount}` : "—",
              actions: isCancelled ? (
                <span className="text-xs text-ink-muted">Cancelled</span>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      disabled={pendingId === rentalId}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel rental?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel rental {rentalId || "this booking"}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancel(rentalId)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {pendingId === rentalId ? "Cancelling…" : "Cancel rental"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ),
            };
          })}
        />
      )}
    </DashboardShell>
  );
}
