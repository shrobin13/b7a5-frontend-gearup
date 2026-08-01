"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyPayments, getMyRentals } from "@/services/customer";
import { useAuthStore } from "@/store/auth-store";
import type { Payment, Rental } from "@/types";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];

const fallbackRentals: Rental[] = [
  { _id: "fallback-rental-1", status: "active", totalAmount: 140, gear: { name: "Trail Pro Tent" }, startDate: "Aug 12", endDate: "Aug 18" },
  { _id: "fallback-rental-2", status: "approved", totalAmount: 98, gear: { name: "Summit Pack" }, startDate: "Aug 22", endDate: "Aug 25" },
];

const fallbackPayments: Payment[] = [
  { _id: "fallback-payment-1", status: "paid", amount: 125 },
  { _id: "fallback-payment-2", status: "paid", amount: 98 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [rentals, setRentals] = useState<Rental[]>(fallbackRentals);
  const [payments, setPayments] = useState<Payment[]>(fallbackPayments);
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
        const [nextRentals, nextPayments] = await Promise.all([getMyRentals(authToken), getMyPayments(authToken)]);
        setRentals(nextRentals ?? fallbackRentals);
        setPayments(nextPayments ?? fallbackPayments);
      } catch {
        setRentals(fallbackRentals);
        setPayments(fallbackPayments);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [isAuthenticated, router, token]);

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Renter";
  const activeRentals = useMemo(
    () => rentals.filter((rental) => ["active", "approved", "pending"].includes((rental.status ?? "").toLowerCase())),
    [rentals],
  );
  const totalSpent = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);

  const recentActivity = [
    ...activeRentals.slice(0, 2).map((rental) => `Booked ${rental.gear?.name ?? "gear"}`),
    ...payments.slice(0, 1).map((payment) => `Paid $${payment.amount ?? 0}`),
  ];

  if (!isAuthenticated) {
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
            {activeRentals.map((rental) => (
              <div key={rental._id ?? rental.gear?.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{rental.gear?.name ?? "Rental item"}</p>
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
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-muted">
            {recentActivity.map((activity) => (
              <p key={activity}>{activity}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
