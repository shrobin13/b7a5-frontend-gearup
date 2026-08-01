import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featuredGear = [
  { name: "Trail Pro Tent", category: "Camping", price: "$28/day" },
  { name: "Summit Pack", category: "Hiking", price: "$18/day" },
  { name: "Glide Bike", category: "Cycling", price: "$36/day" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              GearUp Rental
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
              Rent the gear you need for every adventure.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Discover premium camping, hiking, cycling, and outdoor equipment from trusted local providers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/gear">Browse gear</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredGear.map((item) => (
                <Card key={item.name} className="border-0 bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{item.category}</p>
                    <p className="text-xl font-semibold text-foreground">{item.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
