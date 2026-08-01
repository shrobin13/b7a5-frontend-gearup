"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/services/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gearup.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      const token = response.token ?? response.accessToken;
      if (token) {
        document.cookie = `gearup-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        document.cookie = `gearup-role=${response.user?.role ?? "CUSTOMER"}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login to GearUp</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
