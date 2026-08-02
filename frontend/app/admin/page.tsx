"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminGear, getAdminRentals, getAdminUsers } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { AppUser, Gear, Rental } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];


export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [gear, setGear] = useState<Gear[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
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
        const [nextUsers, nextGear, nextRentals] = await Promise.all([getAdminUsers(), getAdminGear(), getAdminRentals()]);
        setUsers(nextUsers ?? []);
        setGear(nextGear ?? []);
        setRentals(nextRentals ?? []);
      } catch {
        setUsers([]);
        setGear([]);
        setRentals([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Admin";
  const revenue = useMemo(() => rentals.reduce((sum, rental) => sum + Number(rental.totalAmount ?? 0), 0), [rentals]);
  const activityRows = useMemo(
    () => [
      ...users.slice(0, 2).map((entry) => ({ name: entry.name ?? entry.email, type: entry.role ?? "USER", status: entry.isActive ? "active" : "inactive" })),
      ...gear.slice(0, 1).map((entry) => ({ name: entry.name, type: "Gear", status: (entry.isAvailable ?? Number(entry.stockQuantity ?? entry.stock ?? 0) > 0) ? "active" : "pending" })),
      ...rentals.slice(0, 1).map((entry) => ({ name: `Rental ${entry._id ?? "#1"}`, type: "Rental", status: entry.status ?? "pending" })),
    ],
    [gear, rentals, users],
  );

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Admin dashboard</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Platform overview, {displayName}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Users" value={String(users.length)} detail="registered" tone="ink" />
        <MetricCard title="Gear" value={String(gear.length)} detail="listings" tone="pine" />
        <MetricCard title="Rentals" value={String(rentals.length)} detail="active" tone="accent" />
        <MetricCard title="Revenue" value={`$${revenue}`} detail="monthly" tone="ink" />
      </div>

      <p className="mt-4 text-sm text-ink-muted">{loading ? "Syncing latest data..." : "Data refreshed successfully."}</p>

      <div className="mt-8">
        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Platform activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityRows.length ? (
              activityRows.map((row) => (
                <div key={`${row.type}-${row.name}`} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-sm text-ink-muted">{row.type}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
              ))
            ) : (
              <EmptyState title="No data available" description="There is no platform activity to display yet." />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}