"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
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

const fallbackOrders: Rental[] = [
  { _id: "fallback-order-1", status: "pending", totalAmount: 140, startDate: "Aug 12", endDate: "Aug 18", gear: { name: "Trail Pro Tent" } },
  { _id: "fallback-order-2", status: "approved", totalAmount: 98, startDate: "Aug 22", endDate: "Aug 25", gear: { name: "Summit Pack" } },
];

export default function ProviderOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [orders, setOrders] = useState<Rental[]>(fallbackOrders);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      try {
        const nextOrders = await getProviderOrders(authToken);
        setOrders(nextOrders ?? fallbackOrders);
      } catch {
        setOrders(fallbackOrders);
      }
    }

    void loadData();
  }, [isAuthenticated, router, token]);

  if (!isAuthenticated) {
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
    </DashboardShell>
  );
}
