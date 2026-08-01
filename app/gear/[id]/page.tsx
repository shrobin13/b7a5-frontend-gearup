import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reviews = [
  { name: "Maya", rating: 5, text: "Super easy to set up and exactly as described." },
  { name: "Noah", rating: 5, text: "Great condition and the pickup was smooth." },
  { name: "Jules", rating: 4, text: "Solid tent for a weekend trip, worked perfectly." },
];

export default function GearDetailPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Gear detail</p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Trail Pro Tent</h1>
        </div>
        <Button asChild variant="outline" className="rounded-xl border-border bg-background">
          <Link href="/gear" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div className="grid gap-4 md:grid-cols-[1.5fr_0.5fr]">
            <div className="h-[420px] rounded-[2rem] border border-border bg-gradient-to-br from-accent-soft via-surface-muted to-pine-soft shadow-[0_18px_42px_rgba(26,36,32,0.04)]" />
            <div className="grid gap-4">
              <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
              <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
              <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-border bg-surface p-5 shadow-[0_18px_42px_rgba(26,36,32,0.05)]">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span>4.8</span>
            <span>(23 reviews)</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">Price</p>
              <p className="mt-2 font-mono text-3xl font-semibold text-foreground">$28/day</p>
            </div>
            <span className="rounded-full bg-pine-soft px-2.5 py-1 text-xs font-medium text-pine">Available</span>
          </div>

          <p className="mt-5 text-base leading-7 text-ink-muted">
            Spacious 4-person camping tent built for comfort, weather protection, and quick setup on your next outdoor trip.
          </p>

          <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface-muted p-4 text-sm text-ink-muted">
            <p>• Capacity: 4 people</p>
            <p>• Condition: Like new</p>
            <p>• Category: Camping</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Dates</label>
              <div className="rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm text-ink-muted">
                Aug 12 – Aug 18
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Quantity</label>
              <div className="flex w-full max-w-[150px] items-center justify-between rounded-xl border border-border bg-surface-muted px-3 py-2">
                <button type="button" className="text-lg text-ink-muted">−</button>
                <span className="font-medium text-foreground">1</span>
                <button type="button" className="text-lg text-ink-muted">+</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface-muted p-4">
            <div className="flex items-center justify-between text-sm text-ink-muted">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">$168</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-ink-muted">
              <span>Service fee</span>
              <span className="font-mono text-foreground">$12</span>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between text-base font-medium text-foreground">
                <span>Total</span>
                <span className="font-mono">$180</span>
              </div>
            </div>
          </div>

          <Button asChild size="lg" className="mt-6 h-12 w-full rounded-xl bg-accent text-white hover:bg-accent/90">
            <Link href="/payment/success">Reserve — $180</Link>
          </Button>
        </aside>
      </div>

      <section className="mt-12">
        <Card className="border border-border bg-surface">
          <CardHeader>
            <CardTitle className="font-display text-3xl text-ink">Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-foreground">{review.name}</span>
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={`${review.name}-${index}`} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{review.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
