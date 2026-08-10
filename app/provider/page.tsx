"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProviderGear, getProviderOrders } from "@/services/provider";
import { useAuthStore } from "@/store/auth-store";
import { getRentalItemName } from "@/lib/utils";
import type { Gear, Rental } from "@/types";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];


export default function ProviderDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const [gear, setGear] = useState<Gear[]>([]);
  const [orders, setOrders] = useState<Rental[]>([]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    async function loadData() {
      try {
        const [nextGear, nextOrders] = await Promise.all([getProviderGear(), getProviderOrders()]);
        setGear(nextGear ?? []);
        setOrders(nextOrders ?? []);
      } catch {
        setGear([]);
        setOrders([]);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Partner";
  const activeBookings = useMemo(
    () => orders.filter((order) => ["PAID", "PICKED_UP", "RETURNED"].includes((order.status ?? "").toUpperCase())),
    [orders],
  );
  const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Provider dashboard</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Your gear is moving, {displayName}</h1>
        </div>
        <Button className="rounded-xl bg-pine text-white hover:bg-pine/90">+ Add gear</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Listings" value={String(gear.length)} detail="active rentals" tone="pine" />
        <MetricCard title="Active bookings" value={String(activeBookings.length)} detail="paid reservations" tone="accent" />
        <MetricCard title="Revenue" value={`$${revenue}`} detail="this month" tone="ink" />
      </div>

      <div className="mt-8">
        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Recent bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.length ? (
              orders.map((order) => (
                <div key={order._id ?? `${order.gear?.name}-${order.status}`} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-foreground">{getRentalItemName(order) ?? "Rental item"}</p>
                    <p className="mt-1 text-sm text-ink-muted">{order.startDate && order.endDate ? `${order.startDate} – ${order.endDate}` : "Booking request"}</p>
                  </div>
                  <StatusBadge status={order.status ?? "pending"} />
                </div>
              ))
            ) : (
              <EmptyState title="No bookings found" description="There are no paid bookings to fulfil right now." />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
