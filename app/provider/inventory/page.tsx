"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
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

const fallbackInventory: Gear[] = [
  { _id: "fallback-gear-1", name: "Trail Pro Tent", stock: 4, pricePerDay: 28, condition: "Good" },
  { _id: "fallback-gear-2", name: "Summit Pack", stock: 7, pricePerDay: 18, condition: "Excellent" },
];

export default function ProviderInventoryPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [inventory, setInventory] = useState<Gear[]>(fallbackInventory);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      try {
        const nextGear = await getProviderGear(authToken);
        setInventory(nextGear ?? fallbackInventory);
      } catch {
        setInventory(fallbackInventory);
      }
    }

    void loadData();
  }, [isAuthenticated, router, token]);

  if (!isAuthenticated) {
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

      <DataTable
        columns={[
          { key: "name", label: "Gear" },
          { key: "stock", label: "Stock" },
          { key: "pricePerDay", label: "Price" },
          { key: "condition", label: "Condition" },
        ]}
        data={inventory.map((item) => ({
          ...item,
          pricePerDay: item.pricePerDay ? `$${item.pricePerDay}/day` : "—",
        }))}
      />
    </DashboardShell>
  );
}
