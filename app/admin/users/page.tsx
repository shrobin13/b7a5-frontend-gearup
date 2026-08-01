import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

const users = [
  { name: "Ahsan", email: "ahsan@example.com", role: "CUSTOMER", status: "active" },
  { name: "Nadia", email: "nadia@example.com", role: "PROVIDER", status: "active" },
  { name: "Admin", email: "admin@gearup.com", role: "ADMIN", status: "approved" },
];

export default function AdminUsersPage() {
  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Users</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Member directory</h1>
        </div>
        <Button className="rounded-xl bg-ink text-white hover:bg-ink/90">Invite user</Button>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ]}
        data={users}
      />
    </DashboardShell>
  );
}
