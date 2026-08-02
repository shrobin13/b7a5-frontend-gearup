"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getProviderGear } from "@/services/provider";
import { useAuthStore } from "@/store/auth-store";
import type { Gear } from "@/types";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];


export default function ProviderInventoryPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [inventory, setInventory] = useState<Gear[]>([]);
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
        const nextGear = await getProviderGear();
        setInventory(Array.isArray(nextGear) ? nextGear : []);
      } catch {
        setInventory([]);
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
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Inventory</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Your gear library</h1>
        </div>
        <Button className="rounded-xl bg-pine text-white hover:bg-pine/90">+ Add gear</Button>
      </div>

      {loading && inventory.length === 0 ? <p className="mb-4 text-sm text-ink-muted">Loading inventory…</p> : null}
      {!loading && !inventory.length ? (
        <EmptyState title="No inventory found" description="You do not have any gear in inventory yet." />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Gear" },
            { key: "stock", label: "Stock" },
            { key: "pricePerDay", label: "Price" },
            { key: "condition", label: "Condition" },
          ]}
          data={inventory.map((item) => ({
            ...item,
            stock: item.stockQuantity ?? item.stock ?? 0,
            pricePerDay: item.pricePerDay ? `$${item.pricePerDay}/day` : "—",
          }))}
        />
      )}
    </DashboardShell>
  );
}