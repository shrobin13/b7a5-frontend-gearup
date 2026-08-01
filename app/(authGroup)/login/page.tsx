"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(form);
      const token = response.token ?? response.accessToken ?? null;

      if (!token) {
        throw new Error("Login response did not include an auth token");
      }

      setAuth(token, response.user ?? { email: form.email, name: form.email.split("@")[0], role: "CUSTOMER" });
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-md border border-border bg-surface/90 shadow-[0_18px_42px_rgba(26,36,32,0.08)]">
        <CardHeader className="space-y-3 pb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-display text-white">
            G
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Welcome back</p>
            <h1 className="mt-2 font-display text-3xl text-ink">Log in</h1>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 rounded-xl border-border bg-surface-muted"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/login" className="text-xs font-medium text-accent hover:text-accent-hover">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="h-11 rounded-xl border-border bg-surface-muted pr-11"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-ink-muted transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-border text-accent focus:ring-accent" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <Button type="submit" size="lg" className="h-12 w-full rounded-xl" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-ink-muted">
                <span className="bg-surface px-2">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-ink-muted">
              New here?{" "}
              <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
                Create an account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

