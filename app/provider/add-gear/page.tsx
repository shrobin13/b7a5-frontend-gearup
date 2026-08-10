"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGear, getAllCategories, type Category } from "@/services/gear";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];

export default function AddGearPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    pricePerDay: "",
    stock: "",
    description: "",
    imageUrl: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const nextCategories = await getAllCategories();
        if (isMounted && Array.isArray(nextCategories)) {
          setCategories(nextCategories.filter((category) => category?.name));
        }
      } catch {
        if (isMounted) {
          setCategories([]);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (!form.name.trim()) {
      setSubmitError("Gear name is required.");
      return;
    }

    const pricePerDay = Number(form.pricePerDay);
    const stock = Number(form.stock);
    const description = form.description.trim();
    const brand = form.brand.trim();
    const imageUrl = form.imageUrl.trim();

    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      setSubmitError("Enter a valid price per day.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setSubmitError("Enter a valid stock quantity.");
      return;
    }

    if (description && description.length < 10) {
      setSubmitError("Description must be at least 10 characters.");
      return;
    }

    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        setSubmitError("Image URL must be a valid URL (e.g. https://…).");
        return;
      }
    }

    setSubmitting(true);

    try {
      await createGear({
        name: form.name.trim(),
        category: form.category || undefined,
        pricePerDay,
        stock,
        description: description || undefined,
        brand: brand || undefined,
        imageUrl: imageUrl || undefined,
      });
      toast.success("Gear created");
      router.push("/provider/inventory");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create gear";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell title="Provider" accent="pine" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-pine">Add gear</p>
        <h1 className="mt-2 font-display text-4xl text-ink">List a new item</h1>
      </div>

      <Card className="border border-border bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-2xl text-ink">Gear details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Gear name</Label>
              <Input id="add-name" placeholder="e.g. 4-person dome tent" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category">Category</Label>
              <select
                id="add-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-surface-muted px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">Select a category…</option>
                {categories.map((category) => (
                  <option key={category.id ?? category.name} value={category.id ?? ""}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-brand">Brand</Label>
              <Input id="add-brand" placeholder="e.g. Big Agnes" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="add-price">Price per day ($)</Label>
                <Input id="add-price" type="number" min="0" step="0.01" placeholder="24.00" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-stock">Stock</Label>
                <Input id="add-stock" type="number" min="0" step="1" placeholder="3" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-description">Description</Label>
              <textarea
                id="add-description"
                rows={3}
                placeholder="Describe condition, included accessories, pickup details…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-image">Image URL</Label>
              <Input id="add-image" type="url" placeholder="https://example.com/tent.jpg" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>

            {submitError ? <p role="alert" className="text-sm text-destructive">{submitError}</p> : null}
            <Button type="submit" className="w-full rounded-xl bg-pine text-white hover:bg-pine/90" disabled={submitting}>
              {submitting ? "Saving..." : "Save gear"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}