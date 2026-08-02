"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getAdminGear } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { Gear } from "@/types";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];


export default function AdminGearPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [gear, setGear] = useState<Gear[]>([]);
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
        const nextGear = await getAdminGear();
        setGear(Array.isArray(nextGear) ? nextGear : []);
      } catch {
        setGear([]);
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
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Gear</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Moderation queue</h1>
      </div>

      {loading && gear.length === 0 ? <p className="mb-4 text-sm text-ink-muted">Loading gear…</p> : null}
      {!loading && !gear.length ? (
        <EmptyState title="No gear found" description="There is no gear data to review right now." />
      ) : (
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
      )}
    </DashboardShell>
  );
}
