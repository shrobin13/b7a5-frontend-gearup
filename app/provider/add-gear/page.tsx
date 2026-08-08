"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createGear } from "@/services/gear";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];

export default function AddGearPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", pricePerDay: "", stock: "", category: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (!form.name.trim()) {
      setSubmitError("Gear name is required.");
      return;
    }

    const pricePerDay = Number(form.pricePerDay);
    const stock = Number(form.stock);

    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      setSubmitError("Enter a valid price per day.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setSubmitError("Enter a valid stock quantity.");
      return;
    }

    setSubmitting(true);

    try {
      await createGear({
        name: form.name.trim(),
        category: form.category.trim() || undefined,
        pricePerDay,
        stockQuantity: stock,
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
            <Input placeholder="Gear name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Price per day" type="number" min="0" step="0.01" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required />
            <Input placeholder="Stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
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