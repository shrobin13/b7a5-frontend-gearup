"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddGearPage() {
  const [form, setForm] = useState({ name: "", pricePerDay: "", stock: "" });

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Add gear</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Gear name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Price per day" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
          <Input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <Button className="w-full">Save gear</Button>
        </CardContent>
      </Card>
    </main>
  );
}
