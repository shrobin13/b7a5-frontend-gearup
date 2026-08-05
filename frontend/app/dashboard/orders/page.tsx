"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cancelRental, getMyRentals, getRentalById } from "@/services/customer";
import { useAuthStore } from "@/store/auth-store";
import type { Rental } from "@/types";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Detail dialog (getRentalById)
  const [detailRental, setDetailRental] = useState<Rental | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

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
        const nextRentals = await getMyRentals();
        setRentals(Array.isArray(nextRentals) ? nextRentals : []);
      } catch {
        setRentals([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelRental(id);
      toast.success("Rental cancelled");
      const nextRentals = await getMyRentals();
      setRentals(Array.isArray(nextRentals) ? nextRentals : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel rental");
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewDetails = async (id: string) => {
    if (!id) {
      return;
    }

    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const nextRental = await getRentalById(id);
      setDetailRental(nextRental);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load rental details");
      setDetailRental(null);
    } finally {
      setDetailLoading(false);
    }
  };

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  const cancellableStatuses = ["pending", "approved", "active", "confirmed"];

  return (
    <DashboardShell title="Account" accent="accent" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Orders</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Your reservations</h1>
      </div>

      {loading && rentals.length === 0 ? <p className="mb-4 text-sm text-ink-muted">Loading reservations…</p> : null}
      {!loading && !rentals.length ? (
        <EmptyState
          title="No orders yet"
          description="Your rental reservations will appear here once you start booking gear."
          actionLabel="Browse gear"
          href="/gear"
        />
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => {
            const rentalId = rental._id ?? rental.id ?? "";
            const isCancelling = cancellingId === rentalId;
            const status = (rental.status ?? "").toLowerCase();
            const cancellable = cancellableStatuses.includes(status);

            return (
              <Card key={rentalId} className="border border-border bg-surface">
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-foreground">{rental.gear?.name ?? "Rental item"}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {rental.startDate && rental.endDate ? `${rental.startDate} – ${rental.endDate}` : "Scheduled booking"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={rental.status ?? "pending"} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg"
                      title="View details"
                      onClick={() => handleViewDetails(rentalId)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {cancellable ? (
                      <Button variant="outline" size="sm" className="rounded-lg" disabled={isCancelling} onClick={() => handleCancel(rentalId)}>
                        {isCancelling ? "Cancelling..." : "Cancel"}
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Rental detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rental details</DialogTitle>
            <DialogDescription>Details for this reservation.</DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading details…</p>
          ) : detailRental ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Item</span>
                <span>{detailRental.gear?.name ?? "Rental item"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={detailRental.status ?? "pending"} />
              </div>
              {detailRental.startDate && detailRental.endDate ? (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Dates</span>
                  <span>{detailRental.startDate} – {detailRental.endDate}</span>
                </div>
              ) : null}
              {detailRental.totalAmount != null ? (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-mono">${detailRental.totalAmount}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load rental details.</p>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
