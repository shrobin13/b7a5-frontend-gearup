"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const sidebarItems = [
  { href: "/provider", label: "Overview" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Orders" },
  { href: "/provider/add-gear", label: "Add gear" },
];

export default function AddGearPage() {
  const [form, setForm] = useState({ name: "", pricePerDay: "", stock: "", category: "" });

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
        <CardContent className="space-y-4">
          <Input placeholder="Gear name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Price per day" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
          <Input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <Button className="w-full rounded-xl bg-pine text-white hover:bg-pine/90">Save gear</Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
