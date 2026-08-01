import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];

const orders = [
  { customer: "Amina", item: "Trail Pro Tent", dates: "Aug 12 – Aug 18", status: "pending" },
  { customer: "Rahim", item: "Summit Pack", dates: "Aug 22 – Aug 25", status: "approved" },
  { customer: "Talia", item: "Alpine Stove", dates: "Sep 03 – Sep 06", status: "active" },
];

export default function ProviderOrdersPage() {
  return (
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Orders</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Booking queue</h1>
        </div>
        <Button variant="outline" className="rounded-xl border-border bg-background">
          Export report
        </Button>
      </div>

      <DataTable
        columns={[
          { key: "customer", label: "Customer" },
          { key: "item", label: "Item" },
          { key: "dates", label: "Dates" },
          { key: "status", label: "Status" },
        ]}
        data={orders}
      />
    </DashboardShell>
  );
}
