"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllGear } from "@/services/gear";
import { GearCard } from "@/components/shared/gear-card";
import { Button } from "@/components/ui/button";

const fallbackItems = [
  { id: "trail-pro-tent", name: "Trail Pro Tent", category: "Tent", price: 28, rating: 4.9, available: true },
  { id: "summit-pack", name: "Summit Pack", category: "Backpack", price: 18, rating: 4.8, available: true },
  { id: "alpine-stove", name: "Alpine Stove", category: "Camp", price: 21, rating: 4.9, available: true },
  { id: "glide-bike", name: "Glide Bike", category: "Cycling", price: 36, rating: 4.7, available: false },
  { id: "peak-lantern", name: "Peak Lantern", category: "Lighting", price: 12, rating: 4.5, available: true },
  { id: "river-trek-boots", name: "River Trek Boots", category: "Footwear", price: 24, rating: 4.8, available: true },
  { id: "contour-map-kit", name: "Contour Map Kit", category: "Navigation", price: 15, rating: 4.6, available: true },
  { id: "basecamp-chair", name: "Basecamp Chair", category: "Camp", price: 14, rating: 4.7, available: false },
];

export default function GearPage() {
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    let isMounted = true;

    const loadGear = async () => {
      try {
        const gear = await getAllGear();

        if (!isMounted || !Array.isArray(gear) || !gear.length) {
          return;
        }

        const mapped = gear.map((item) => ({
          id: item.id ?? item._id ?? item.name,
          name: item.name,
          category: item.category ?? "Camp",
          price: Number(item.pricePerDay ?? 0),
          rating: Number(item.rating ?? 4.5),
          available: (item.stock ?? 0) > 0,
        }));

        setItems(mapped);
      } catch {
        // Use the fallback catalog when the API is unavailable.
      }
    };

    void loadGear();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Gear collection</p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Find your next trip setup</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/">Back home</Link>
          </Button>
          <Button className="rounded-xl" variant="secondary">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-display text-2xl text-ink">Filters</h2>
          <div className="mt-5 space-y-5 text-sm text-ink-muted">
            <div>
              <p className="mb-2 font-medium text-foreground">Category</p>
              <div className="space-y-2">
                {['Tents', 'Backpacks', 'Camp', 'Navigation', 'Footwear'].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-border text-accent" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Price range</p>
              <div className="h-2 rounded-full bg-surface-muted">
                <div className="h-2 w-2/3 rounded-full bg-accent" />
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Availability</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="availability" className="h-4 w-4 text-accent" defaultChecked />
                  Any
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="availability" className="h-4 w-4 text-accent" />
                  Available now
                </label>
              </div>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-ink-muted">Showing {items.length} items</p>
            <Button variant="outline" size="sm" className="rounded-lg">
              Sort: Recommended
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <GearCard key={item.id ?? item.name} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
