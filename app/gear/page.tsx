import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  { name: "CampTent Deluxe", price: "$28/day", category: "Camping" },
  { name: "Trail Runner Pack", price: "$18/day", category: "Hiking" },
  { name: "Terrain Pro Bike", price: "$36/day", category: "Cycling" },
  { name: "Summit Jacket", price: "$22/day", category: "Outdoor" },
];

export default function GearPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Gear collection</p>
          <h1 className="mt-2 text-3xl font-bold">Find the right gear for your trip</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.name} className="overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-primary/20 via-muted to-secondary" />
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{item.category}</p>
              <div className="flex items-center justify-between">
                <strong className="text-lg text-foreground">{item.price}</strong>
                <Button asChild size="sm">
                  <Link href="/gear/sample-id">View details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
