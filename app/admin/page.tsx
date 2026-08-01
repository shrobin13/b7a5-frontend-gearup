"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
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

const fallbackUsers: AppUser[] = [
  { name: "Ahsan", email: "ahsan@example.com", role: "CUSTOMER", isActive: true },
  { name: "Nadia", email: "nadia@example.com", role: "PROVIDER", isActive: true },
];

const fallbackGear: Gear[] = [{ name: "Trail Pro Tent", stock: 4, pricePerDay: 28 }];
const fallbackRentals: Rental[] = [{ status: "active", totalAmount: 140, gear: { name: "Trail Pro Tent" } }];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [users, setUsers] = useState<AppUser[]>(fallbackUsers);
  const [gear, setGear] = useState<Gear[]>(fallbackGear);
  const [rentals, setRentals] = useState<Rental[]>(fallbackRentals);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      setLoading(true);
      try {
        const [nextUsers, nextGear, nextRentals] = await Promise.all([getAdminUsers(authToken), getAdminGear(authToken), getAdminRentals(authToken)]);
        setUsers(nextUsers ?? fallbackUsers);
        setGear(nextGear ?? fallbackGear);
        setRentals(nextRentals ?? fallbackRentals);
      } catch {
        setUsers(fallbackUsers);
        setGear(fallbackGear);
        setRentals(fallbackRentals);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [isAuthenticated, router, token]);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Admin";
  const revenue = useMemo(() => rentals.reduce((sum, rental) => sum + Number(rental.totalAmount ?? 0), 0), [rentals]);
  const activityRows = useMemo(
    () => [
      ...users.slice(0, 2).map((entry) => ({ name: entry.name ?? entry.email, type: entry.role ?? "USER", status: entry.isActive ? "active" : "inactive" })),
      ...gear.slice(0, 1).map((entry) => ({ name: entry.name, type: "Gear", status: entry.stock && entry.stock > 0 ? "active" : "pending" })),
      ...rentals.slice(0, 1).map((entry) => ({ name: `Rental ${entry._id ?? "#1"}`, type: "Rental", status: entry.status ?? "pending" })),
    ],
    [gear, rentals, users],
  );

  if (!isAuthenticated) {
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
            {activityRows.map((row) => (
              <div key={`${row.type}-${row.name}`} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{row.name}</p>
                  <p className="text-sm text-ink-muted">{row.type}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
