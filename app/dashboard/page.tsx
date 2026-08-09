"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyPayments, getMyRentals } from "@/services/customer";
import { useAuthStore } from "@/store/auth-store";
import { getRentalItemName } from "@/lib/utils";
import type { Payment, Rental } from "@/types";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];


export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
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
        const [nextRentals, nextPayments] = await Promise.all([getMyRentals(), getMyPayments()]);
        setRentals(nextRentals ?? []);
        setPayments(nextPayments ?? []);
      } catch {
        setRentals([]);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Renter";
  const activeRentals = useMemo(
    () => rentals.filter((rental) => ["active", "approved", "pending"].includes((rental.status ?? "").toLowerCase())),
    [rentals],
  );
  const totalSpent = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);

  const recentActivity = [
    ...activeRentals.slice(0, 2).map((rental) => `Booked ${getRentalItemName(rental) ?? "gear"}`),
    ...payments.slice(0, 1).map((payment) => `Paid $${payment.amount ?? 0}`),
  ];

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Account" accent="accent" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Customer dashboard</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Welcome back, {displayName}</h1>
        </div>
        <Button className="rounded-xl bg-accent text-white hover:bg-accent/90">Book a new rental</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Active rentals" value={String(activeRentals.length)} detail="Trips in motion" tone="accent" />
        <MetricCard title="Total spent" value={`$${totalSpent}`} detail="Across all bookings" tone="pine" />
        <MetricCard title="Status" value={loading ? "Syncing" : "Ready"} detail="Latest activity" tone="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Your active rentals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRentals.length ? (
              activeRentals.map((rental) => (
                <div key={rental._id ?? rental.gear?.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-foreground">{getRentalItemName(rental) ?? "Rental item"}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {rental.startDate && rental.endDate ? `${rental.startDate} – ${rental.endDate}` : "Scheduled booking"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={rental.status ?? "pending"} />
                    <Button variant="outline" size="sm" className="rounded-lg">
                      View
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No data available" description="You do not have any active rentals right now." />
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-muted">
            {recentActivity.length ? (
              recentActivity.map((activity) => (
                <p key={activity}>{activity}</p>
              ))
            ) : (
              <EmptyState title="No data available" description="No recent activity has been recorded yet." />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
