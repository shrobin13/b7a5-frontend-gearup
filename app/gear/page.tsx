"use client";

import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { getAllCategories, getAllGear } from "@/services/gear";
import { GearCard } from "@/components/shared/gear-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryName } from "@/lib/utils";

type GearItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  available: boolean;
  brand?: string;
  image?: string;
};

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

const SORT_LABELS: Record<SortKey, string> = {
  recommended: "Sort: Recommended",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Rating: Highest First",
};

export default function GearPage() {
  const [items, setItems] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [backendCategories, setBackendCategories] = useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [availability, setAvailability] = useState<"any" | "available">("any");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const categories = await getAllCategories();
        if (isMounted && Array.isArray(categories)) {
          const names = categories
            .map((c) => c?.name?.trim())
            .filter((name): name is string => Boolean(name));
          setBackendCategories(Array.from(new Set(names)));
        }
      } catch {}
    };

    void loadCategories();

    const loadGear = async () => {
      try {
        const gear = await getAllGear();

        if (!isMounted || !Array.isArray(gear)) {
          return;
        }

        const mapped: GearItem[] = gear.map((item) => ({
          id: item.id ?? item._id ?? item.name,
          name: item.name,
          category: getCategoryName(item.category),
          price: Number(item.pricePerDay ?? 0),
          rating: Number(item.rating ?? 4.5),
          available: Boolean(item.isAvailable ?? Number(item.stockQuantity ?? item.stock ?? 0) > 0),
          brand: typeof item.brand === "string" && item.brand.trim() ? item.brand.trim() : undefined,
          image:
            typeof item.image === "string" && item.image.trim()
              ? item.image.trim()
              : Array.isArray(item.images) && typeof item.images[0] === "string"
                ? item.images[0]
                : undefined,
        }));

        setItems(mapped);

        const highest = mapped.reduce((max, item) => (item.price > max ? item.price : max), 0);
        if (highest > 0) {
          setMaxPrice(highest);
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadGear();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(backendCategories);
    for (const item of items) {
      set.add(item.category);
    }
    return Array.from(set).sort();
  }, [items, backendCategories]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.brand) {
        set.add(item.brand);
      }
    }
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.brand ?? "").toLowerCase().includes(query),
      );
    }

    if (selectedCategories.length > 0) {
      const wanted = new Set(selectedCategories);
      result = result.filter((item) => wanted.has(item.category));
    }

    if (selectedBrands.length > 0) {
      const wanted = new Set(selectedBrands);
      result = result.filter((item) => item.brand && wanted.has(item.brand));
    }

    if (Number.isFinite(maxPrice)) {
      result = result.filter((item) => item.price <= maxPrice);
    }

    if (availability === "available") {
      result = result.filter((item) => item.available);
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
      default:
        result = [...result].sort(
          (a, b) => Number(b.available) - Number(a.available) || b.rating - a.rating,
        );
        break;
    }

    return result;
  }, [items, search, selectedCategories, selectedBrands, maxPrice, availability, sort]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    availability === "available" ||
    maxPrice !== Infinity;

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  }

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand],
    );
  }

  function resetFilters() {
    setSearch("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setAvailability("any");
    const highest = items.reduce((max, item) => (item.price > max ? item.price : max), 0);
    setMaxPrice(highest > 0 ? highest : Infinity);
  }

  const priceMax = Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : 0;

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
          <Button
            className="rounded-xl lg:hidden"
            variant="secondary"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <SlidersHorizontal className="mr-2 h-4 w-4" />
            )}
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside
          className={
            filtersOpen
              ? "grid h-fit self-start rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-6"
              : "hidden h-fit self-start rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-6 lg:grid"
          }
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Filters</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-accent hover:text-accent-hover"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mt-5">
            <SearchField value={search} onChange={setSearch} placeholder="Search gear, brand…" />
          </div>

          <div className="mt-5 space-y-5 text-sm text-ink-muted">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-foreground">Category</p>
                {selectedCategories.length > 0 && (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold text-accent">
                    {selectedCategories.length} selected
                  </span>
                )}
              </div>
              <div className="space-y-2.5">
                {categories.map((category) => {
                  const checked = selectedCategories.includes(category);
                  return (
                    <label
                      key={category}
                      className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleCategory(category)}
                        className="border-border data-checked:border-accent data-checked:bg-accent"
                      />
                      <span
                        className={
                          checked
                            ? "font-medium text-foreground"
                            : "text-ink-muted group-hover:text-foreground"
                        }
                      >
                        {category}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Separator />

            {brands.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-foreground">Brand</p>
                  {selectedBrands.length > 0 && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold text-accent">
                      {selectedBrands.length} selected
                    </span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {brands.map((brand) => {
                    const checked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleBrand(brand)}
                          className="border-border data-checked:border-accent data-checked:bg-accent"
                        />
                        <span
                          className={
                            checked
                              ? "font-medium text-foreground"
                              : "text-ink-muted group-hover:text-foreground"
                          }
                        >
                          {brand}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-foreground">Price range</p>
                <p className="font-mono text-xs text-ink-muted">
                  ${Number.isFinite(maxPrice) ? maxPrice.toFixed(0) : "—"} max
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={priceMax || 1}
                step={1}
                value={Number.isFinite(maxPrice) ? maxPrice : 0}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-accent"
                aria-label="Maximum price per day"
              />
              <div className="mt-1 flex justify-between text-[0.65rem] text-ink-muted">
                <span>$0</span>
                <span>${priceMax.toFixed(0)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="mb-3 font-medium text-foreground">Availability</p>
              <div className="space-y-2.5">
                <label className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted">
                  <input
                    type="radio"
                    name="availability"
                    className="h-4 w-4 accent-accent"
                    checked={availability === "any"}
                    onChange={() => setAvailability("any")}
                  />
                  <span className="text-ink-muted group-hover:text-foreground">Any</span>
                </label>
                <label className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted">
                  <input
                    type="radio"
                    name="availability"
                    className="h-4 w-4 accent-accent"
                    checked={availability === "available"}
                    onChange={() => setAvailability("available")}
                  />
                  <span className="text-ink-muted group-hover:text-foreground">Available now</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="hidden h-4 w-4 text-ink-muted sm:block" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label="Sort gear"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <GearCard key={item.id ?? item.name} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No data available"
              description={
                hasActiveFilters
                  ? "No gear matches your current filters. Try adjusting or clearing them."
                  : "There are no gear listings to show right now."
              }
            />
          )}
        </section>
      </div>
    </main>
  );
}