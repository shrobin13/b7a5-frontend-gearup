"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getProviderOrders } from "@/services/provider";
import { useAuthStore } from "@/store/auth-store";
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

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Orders</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Booking queue</h1>
        </div>
        <Button variant="outline" className="rounded-xl border-border bg-background">
          Export report
        </Button>
      </div>

      {loading && orders.length === 0 ? <p className="mb-4 text-sm text-ink-muted">Loading orders…</p> : null}
      {!loading && !orders.length ? (
        <EmptyState title="No orders found" description="You do not have any booking requests right now." />
      ) : (
        <DataTable
          columns={[
            { key: "gear", label: "Item" },
            { key: "dates", label: "Dates" },
            { key: "status", label: "Status" },
          ]}
          data={orders.map((order) => ({
            ...order,
            gear: order.gear?.name ?? "Rental item",
            dates: order.startDate && order.endDate ? `${order.startDate} – ${order.endDate}` : "Scheduled",
          }))}
        />
      )}
    </DashboardShell>
  );
}
