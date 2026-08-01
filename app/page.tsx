"use client";

import Link from "next/link";
import { ArrowRight, Compass, Flame, MapPin, ShieldCheck, TentTree } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllGear } from "@/services/gear";
import { GearCard } from "@/components/shared/gear-card";
import { Button } from "@/components/ui/button";

const fallbackGear = [
  { id: "trail-pro-tent", name: "Trail Pro Tent", category: "Tent", price: 28, rating: 4.9, available: true },
  { id: "summit-pack", name: "Summit Pack", category: "Backpack", price: 18, rating: 4.8, available: true },
  { id: "camp-lantern", name: "Camp Lantern", category: "Camp", price: 12, rating: 4.7, available: false },
  { id: "alpine-stove", name: "Alpine Stove", category: "Cookware", price: 21, rating: 4.9, available: true },
];

const categories = [
  { label: "Tents", icon: TentTree },
  { label: "Backpacks", icon: Compass },
  { label: "Stoves", icon: Flame },
  { label: "Navigation", icon: Compass },
  { label: "Footwear", icon: MapPin },
];

const steps = [
  "Book your dates",
  "Provider approves",
  "Pick up and head out",
];

export default function HomePage() {
  const [featuredGear, setFeaturedGear] = useState(fallbackGear);

  useEffect(() => {
    let isMounted = true;

    const loadGear = async () => {
      try {
        const gear = await getAllGear();

        if (!isMounted || !Array.isArray(gear) || !gear.length) {
          return;
        }

        const mapped = gear
          .map((item) => ({
            id: item.id ?? item._id ?? item.name,
            name: item.name,
            category: item.category ?? "Camp",
            price: Number(item.pricePerDay ?? 0),
            rating: Number(item.rating ?? 4.5),
            available: (item.stock ?? 0) > 0,
          }))
          .slice(0, 4);

        setFeaturedGear(mapped);
      } catch {
        // Keep the static fallback if the API is unavailable.
      }
    };

    void loadGear();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-40" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="relative">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Trailhead rental
            </span>
            <h1 className="mt-6 max-w-xl font-display text-5xl leading-none text-ink md:text-7xl">
              Gear up.<br />
              Head out.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">
              Book trusted outdoor gear for the exact trip you have planned — tents, packs, stoves, and more from local adventurers.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 rounded-xl px-6">
                <Link href="/gear">Browse gear</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 rounded-xl px-6">
                <Link href="/about">How it works</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-pine" />
                Curated gear
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-pine" />
                Local pickup
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-border bg-surface p-5 shadow-[0_20px_50px_rgba(26,36,32,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Popular near you</p>
                  <h2 className="mt-2 text-2xl font-display text-ink">Ready to roll</h2>
                </div>
                <span className="rounded-full bg-pine-soft px-2.5 py-1 text-xs font-medium text-pine">Live stock</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {featuredGear.slice(0, 4).map((item) => (
                  <GearCard key={item.id ?? item.name} item={item} compact />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-ink md:text-3xl">Browse by category</h2>
          <Link href="/gear" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
            View all gear <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="group flex min-w-[150px] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-pine">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Featured gear</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Popular near you</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredGear.map((item) => (
            <GearCard key={item.id ?? item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">How GearUp works</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Three simple steps</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-border bg-surface-muted p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.15em] text-ink-muted">Step {index + 1}</span>
                </div>
                <p className="text-lg font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
