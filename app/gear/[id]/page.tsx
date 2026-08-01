import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GearDetailPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Gear detail</p>
            <h1 className="mt-2 text-3xl font-bold">Trail Pro Tent</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/gear">Back to catalog</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-72 rounded-2xl bg-gradient-to-br from-primary/25 via-secondary to-muted" />
          <div className="space-y-5">
            <p className="text-xl font-semibold text-primary">$28/day</p>
            <p className="text-muted-foreground">
              Spacious 4-person camping tent built for comfort, weather protection, and quick setup on your next outdoor trip.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Capacity: 4 people</li>
              <li>• Condition: New</li>
              <li>• Category: Camping</li>
            </ul>
            <Button size="lg">Rent this gear</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
