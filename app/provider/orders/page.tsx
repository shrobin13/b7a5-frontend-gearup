"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderOrders, updateProviderOrder } from "@/services/provider";
import { useAuthStore } from "@/store/auth-store";
import { getRentalItemName, humanizeRentalStatus } from "@/lib/utils";
import type { Rental } from "@/types";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];


export default function ProviderOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [orders, setOrders] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
        const nextOrders = await getProviderOrders();
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateProviderOrder(id, status);
      const message =
        status === "PICKED_UP"
          ? "Order marked as picked up"
          : status === "RETURNED"
            ? "Order marked as returned"
            : `Order ${status.toLowerCase()}`;
      toast.success(message);
      const nextOrders = await getProviderOrders();
      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Orders</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Bookings</h1>
        </div>
        <Button variant="outline" className="rounded-xl border-border bg-background">
          Export report
        </Button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 w-full">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : null}
      {!loading && !orders.length ? (
        <EmptyState title="No bookings found" description="There are no paid bookings to fulfil right now." />
      ) : (
        <DataTable
          columns={[
            { key: "gear", label: "Item" },
            { key: "dates", label: "Dates" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
          data={orders.map((order) => {
            const orderId = order._id ?? order.id ?? "";
            const isUpdating = updatingId === orderId;
            const statusKey = (order.status ?? "").toUpperCase();
            const isReturned = statusKey === "RETURNED" || statusKey === "CANCELLED";

            return {
              ...order,
              gear: getRentalItemName(order) ?? "Rental item",
              dates: order.startDate && order.endDate ? `${order.startDate} – ${order.endDate}` : "Scheduled",
              status: humanizeRentalStatus(order.status),
              actions: (
                <div className="flex items-center gap-2">
                  {statusKey === "PAID" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(orderId, "PICKED_UP")}
                    >
                      {isUpdating ? "Updating..." : "Mark picked up"}
                    </Button>
                  ) : null}
                  {statusKey === "PICKED_UP" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(orderId, "RETURNED")}
                    >
                      {isUpdating ? "Updating..." : "Mark returned"}
                    </Button>
                  ) : null}
                  {isReturned ? <span className="text-xs text-ink-muted">Completed</span> : null}
                  {!["PAID", "PICKED_UP", "RETURNED", "CANCELLED"].includes(statusKey) ? (
                    <span className="text-xs text-ink-muted">Awaiting payment</span>
                  ) : null}
                </div>
              ),
            };
          })}
        />
      )}
    </DashboardShell>
  );
}