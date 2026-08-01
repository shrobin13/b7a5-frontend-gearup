"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { getAdminRentals } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { Rental } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

const fallbackRentals: Rental[] = [
  { _id: "fallback-rental-1", status: "active", totalAmount: 84, gear: { name: "Trail Pro Tent" } },
  { _id: "fallback-rental-2", status: "completed", totalAmount: 42, gear: { name: "Summit Pack" } },
];

export default function AdminRentalsPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [rentals, setRentals] = useState<Rental[]>(fallbackRentals);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      try {
        const nextRentals = await getAdminRentals(authToken);
        setRentals(nextRentals ?? fallbackRentals);
      } catch {
        setRentals(fallbackRentals);
      }
    }

    void loadData();
  }, [isAuthenticated, router, token]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Rentals</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Booking activity</h1>
      </div>

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
    </DashboardShell>
  );
}
