import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function PaymentsPage() {
  return (
    <DashboardShell title="Account" accent="accent" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Payments</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Payment history</h1>
      </div>

      <EmptyState
        title="No payment history"
        description="Completed charges and checkout receipts will appear here."
        actionLabel="Browse gear"
        href="/gear"
      />
    </DashboardShell>
  );
}
