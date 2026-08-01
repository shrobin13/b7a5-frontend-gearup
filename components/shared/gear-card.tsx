import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type GearCardItem = {
  name: string;
  category: string;
  price: number;
  rating: number;
  available: boolean;
};

export function GearCard({
  item,
  compact = false,
}: {
  item: GearCardItem;
  compact?: boolean;
}) {
  return (
    <Card className="group h-full overflow-hidden border border-border bg-surface transition-all duration-150 hover:-translate-y-1 hover:border-accent/50">
      <div className="relative">
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-surface-muted via-surface to-accent-soft text-3xl font-display text-ink opacity-80">
          {item.name.slice(0, 2).toUpperCase()}
        </div>
        <button
          type="button"
          aria-label={`Save ${item.name}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/90 text-ink-muted shadow-sm transition-colors hover:text-accent"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-muted">{item.category}</p>
            <CardTitle className="mt-2 text-lg leading-tight text-ink">{item.name}</CardTitle>
          </div>
          <Badge
            variant={item.available ? "secondary" : "outline"}
            className={item.available ? "bg-pine-soft text-pine" : "bg-surface-muted text-ink-muted"}
          >
            {item.available ? "Available" : "Booked"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={compact ? "pt-0" : "pt-0 pb-3"}>
        <div className="flex items-center gap-1 text-sm text-ink-muted">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span>{item.rating}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-muted">Price/day</p>
            <p className="mt-2 font-mono text-xl font-semibold text-foreground">${item.price}</p>
          </div>
          {!compact && (
            <Button asChild size="sm" className="rounded-lg px-4">
              <Link href="/gear">Reserve</Link>
            </Button>
          )}
        </div>
      </CardContent>

      {!compact && (
        <CardFooter className="pt-0">
          <Link href="/gear" className="text-sm font-medium text-accent hover:text-accent-hover">
            View details →
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
