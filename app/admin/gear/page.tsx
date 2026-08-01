"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { getAdminGear } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { Gear } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

const fallbackGear: Gear[] = [
  { _id: "fallback-admin-gear-1", name: "Trail Pro Tent", provider: "North Peak", stock: 4, condition: "Good" },
  { _id: "fallback-admin-gear-2", name: "Glide Bike", provider: "City Ride", stock: 2, condition: "Excellent" },
];

export default function AdminGearPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [gear, setGear] = useState<Gear[]>(fallbackGear);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      try {
        const nextGear = await getAdminGear(authToken);
        setGear(nextGear ?? fallbackGear);
      } catch {
        setGear(fallbackGear);
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
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Gear</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Moderation queue</h1>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Gear" },
          { key: "provider", label: "Provider" },
          { key: "condition", label: "Condition" },
        ]}
        data={gear.map((item) => ({
          ...item,
          provider: item.provider ?? "Unassigned",
          condition: item.condition ?? "Pending",
        }))}
      />
    </DashboardShell>
  );
}
