"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { register } from "@/services/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      toast.success("Registration successful");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your GearUp account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="md:col-span-2" />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="md:col-span-2" />
            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input placeholder="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="md:col-span-2" />
            <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="md:col-span-2" />
            <Button type="submit" className="md:col-span-2" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
