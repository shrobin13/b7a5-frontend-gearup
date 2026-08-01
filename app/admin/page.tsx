import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

const rows = [
  { name: "Maya R.", type: "User", status: "approved" },
  { name: "Trail Pro Tent", type: "Gear", status: "pending" },
  { name: "Rental #2048", type: "Rental", status: "active" },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Admin dashboard</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Platform overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Users" value="1.2k" detail="registered" tone="ink" />
        <MetricCard title="Gear" value="482" detail="listings" tone="pine" />
        <MetricCard title="Rentals" value="96" detail="active" tone="accent" />
        <MetricCard title="Revenue" value="$14.8k" detail="monthly" tone="ink" />
      </div>

      <div className="mt-8">
        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Platform activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rows.map((row) => (
              <div key={`${row.type}-${row.name}`} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{row.name}</p>
                  <p className="text-sm text-ink-muted">{row.type}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
