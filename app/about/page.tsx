import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Curated local inventory",
    description: "Discover premium gear from trusted providers who know the terrain and the trip ahead.",
    icon: TentTree,
  },
  {
    title: "Flexible, reliable rental flow",
    description: "From booking to pickup, everything is streamlined so you can spend less time organizing and more time outside.",
    icon: Sparkles,
  },
  {
    title: "Built for confidence",
    description: "Verified gear listings, transparent pricing, and quick support help every trip feel well planned.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <section className="rounded-[2rem] border border-border bg-surface p-6 md:p-10">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">About GearUp</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl text-ink md:text-6xl">Built for people who head outside prepared.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">
          GearUp connects adventure seekers with trusted gear providers and makes outdoor rental simple, fast, and dependable.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg" className="rounded-xl bg-pine text-white hover:bg-pine/90">
            <Link href="/gear">Browse gear</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl border-border bg-background">
            <Link href="/contact">Talk to us</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">{description}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] border border-border bg-surface-muted p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Why it matters</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Adventure should be simple.</h2>
          </div>
          <Link href="/gear" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
            Explore the marketplace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
