import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function ProfilePage() {
  return (
    <DashboardShell title="Account" accent="accent" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Profile</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Your account</h1>
      </div>

      <Card className="border border-border bg-surface">
        <CardContent className="space-y-3 p-6 text-sm text-ink-muted">
          <p className="font-medium text-foreground">Alex Morgan</p>
          <p>alex@example.com</p>
          <p>Member since 2025</p>
          <p>Preferred locations: Tahoe, Yosemite, Bend</p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
