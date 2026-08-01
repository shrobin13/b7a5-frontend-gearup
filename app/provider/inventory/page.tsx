import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];

const inventory = [
  { name: "Trail Pro Tent", stock: 4, price: "$28/day", status: "active" },
  { name: "Summit Pack", stock: 7, price: "$18/day", status: "active" },
  { name: "Alpine Stove", stock: 2, price: "$16/day", status: "pending" },
];

export default function ProviderInventoryPage() {
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
          { key: "price", label: "Price" },
          { key: "status", label: "Status" },
        ]}
        data={inventory}
      />
    </DashboardShell>
  );
}
