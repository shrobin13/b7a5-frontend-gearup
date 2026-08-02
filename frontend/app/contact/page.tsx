import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const channels = [
  { label: "Email", value: "hello@gearup.com", icon: Mail },
  { label: "Phone", value: "+1 (415) 555-0147", icon: Phone },
  { label: "Basecamp", value: "113 Alder Street, Tahoe, CA", icon: MapPin },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Contact</p>
          <h1 className="mt-4 font-display text-4xl text-ink md:text-6xl">Let’s plan the next trip.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            Reach out for support, booking questions, or partnership opportunities with the GearUp team.
          </p>

          <div className="mt-8 space-y-4">
            {channels.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-border bg-surface-muted p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</p>
                  <p className="mt-1 font-medium text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
          <h2 className="font-display text-3xl text-ink">Need help fast?</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border bg-background p-4 text-sm text-ink-muted">
              <p className="font-medium text-foreground">Customer support</p>
              <p className="mt-2">Available daily from 7:00 AM to 9:00 PM PT.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 text-sm text-ink-muted">
              <p className="font-medium text-foreground">Provider onboarding</p>
              <p className="mt-2">Support for listing gear, pricing, and pickup logistics.</p>
            </div>
          </div>

          <Button asChild className="mt-6 w-full rounded-xl bg-accent text-white hover:bg-accent/90">
            <Link href="/gear">Start browsing gear</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
