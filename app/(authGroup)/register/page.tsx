"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { register } from "@/services/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  function validateForm(values = form) {
    const nextErrors: Record<string, string> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (values.phone && values.phone.replace(/\D/g, "").length < 7) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    return nextErrors;
  }

  function handleFieldChange(field: keyof typeof form, value: string) {
    setSubmitError(null);
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setLoading(true);

    try {
      await register({ ...form, role });
      toast.success("Registration successful");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-xl border border-border bg-surface/90 shadow-[0_18px_42px_rgba(26,36,32,0.08)]">
        <CardHeader className="space-y-3 pb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-display text-white">
            G
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Create account</p>
            <h1 className="mt-2 font-display text-3xl text-ink">Join GearUp</h1>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Account type</label>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Account type">
                <button
                  type="button"
                  role="radio"
                  aria-checked={role === "CUSTOMER"}
                  onClick={() => setRole("CUSTOMER")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    role === "CUSTOMER"
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-border bg-surface-muted hover:border-ink-muted"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-accent shadow-sm">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">I&apos;m renting gear</span>
                    <span className="block text-xs text-ink-muted">Browse and book as a customer</span>
                  </span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={role === "PROVIDER"}
                  onClick={() => setRole("PROVIDER")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    role === "PROVIDER"
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-border bg-surface-muted hover:border-ink-muted"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-accent shadow-sm">
                    <Store className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">I&apos;m a provider</span>
                    <span className="block text-xs text-ink-muted">List and rent out your gear</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <Input
                id="name"
                placeholder="Alex Carter"
                value={form.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="h-11 rounded-xl border-border bg-surface-muted"
                aria-invalid={Boolean(errors.name)}
                required
              />
              {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="h-11 rounded-xl border-border bg-surface-muted"
                aria-invalid={Boolean(errors.email)}
                required
              />
              {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  className="h-11 rounded-xl border-border bg-surface-muted pr-11"
                  aria-invalid={Boolean(errors.password)}
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
              {errors.password ? <p className="mt-1 text-xs text-destructive">{errors.password}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                  className="h-11 rounded-xl border-border bg-surface-muted pr-11"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  required
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-ink-muted transition-colors hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword ? <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p> : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                className="h-11 rounded-xl border-border bg-surface-muted"
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-foreground">
                Address
              </label>
              <Input
                id="address"
                placeholder="Your city or street address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className="h-11 rounded-xl border-border bg-surface-muted"
              />
            </div>

            {submitError ? (
              <p role="alert" className="text-sm text-destructive md:col-span-2">
                {submitError}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="h-12 w-full rounded-xl md:col-span-2" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-ink-muted md:col-span-2">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
