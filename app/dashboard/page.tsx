import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activeRentals = [
  { name: "Trail Pro Tent", dates: "Aug 12 – Aug 18", status: "active" },
  { name: "Summit Pack", dates: "Aug 22 – Aug 25", status: "approved" },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Customer dashboard</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Welcome back, Alex</h1>
        </div>
        <Button className="rounded-xl">Book a new rental</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Active rentals" value="2" detail="Trips in motion" tone="accent" />
        <MetricCard title="Total spent" value="$340" detail="Across all bookings" tone="pine" />
        <MetricCard title="Reviews" value="3" detail="Posted this season" tone="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Your active rentals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRentals.map((rental) => (
              <div key={rental.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{rental.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{rental.dates}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={rental.status} />
                  <Button variant="outline" size="sm" className="rounded-lg">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-2xl text-ink">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-muted">
            <p>Booked Trail Pro Tent • 2 days ago</p>
            <p>Returned Summit Pack • 1 week ago</p>
            <p>Paid $125 • 10 days ago</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
