import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

const gear = [
  { name: "Trail Pro Tent", provider: "North Peak", status: "pending" },
  { name: "Glide Bike", provider: "City Ride", status: "approved" },
  { name: "Summit Pack", provider: "Peak & Pine", status: "active" },
];

export default function AdminGearPage() {
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
          { key: "status", label: "Status" },
        ]}
        data={gear}
      />
    </DashboardShell>
  );
}
