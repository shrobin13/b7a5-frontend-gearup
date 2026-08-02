"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getAdminRentals } from "@/services/admin";
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

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Rentals</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Booking activity</h1>
      </div>

      {loading && rentals.length === 0 ? <p className="mb-4 text-sm text-ink-muted">Loading rentals…</p> : null}
      {!loading && !rentals.length ? (
        <EmptyState title="No rentals found" description="There are no rental records to show right now." />
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "gear", label: "Item" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
          ]}
          data={rentals.map((rental) => ({
            ...rental,
            id: rental._id ?? "unknown",
            gear: rental.gear?.name ?? "Rental item",
            total: rental.totalAmount ? `$${rental.totalAmount}` : "—",
          }))}
        />
      )}
    </DashboardShell>
  );
}
