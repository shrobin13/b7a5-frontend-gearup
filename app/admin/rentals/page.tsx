import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

const rentals = [
  { id: "R-101", customer: "Ahsan", total: "$84", status: "active" },
  { id: "R-102", customer: "Nadia", total: "$42", status: "completed" },
  { id: "R-103", customer: "Kai", total: "$118", status: "pending" },
];

export default function AdminRentalsPage() {
  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Rentals</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Booking activity</h1>
      </div>

      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "customer", label: "Customer" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
        ]}
        data={rentals}
      />
    </DashboardShell>
  );
}
