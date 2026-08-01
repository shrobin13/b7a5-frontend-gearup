import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  { customer: "Maya R.", gear: "Trail Pro Tent", dates: "Aug 12 – Aug 18", status: "pending" },
  { customer: "Noah S.", gear: "Summit Pack", dates: "Aug 22 – Aug 25", status: "approved" },
  { customer: "Jules K.", gear: "Alpine Stove", dates: "Sep 04 – Sep 07", status: "active" },
];

export default function ProviderDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Provider dashboard</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Your gear is moving</h1>
        </div>
        <Button className="rounded-xl bg-pine text-white hover:bg-pine/90">+ Add gear</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Listings" value="18" detail="active rentals" tone="pine" />
        <MetricCard title="Pending orders" value="4" detail="need action" tone="accent" />
        <MetricCard title="Revenue" value="$3.2k" detail="this month" tone="ink" />
      </div>

      <div className="mt-8">
        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Orders needing action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.map((order) => (
              <div key={`${order.customer}-${order.gear}`} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{order.gear}</p>
                  <p className="mt-1 text-sm text-ink-muted">{order.customer} • {order.dates}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
