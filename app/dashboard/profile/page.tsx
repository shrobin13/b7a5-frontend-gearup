"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import type { AppUser } from "@/types";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, hasHydrated, setAuth } = useAuthStore();
  const [latestUser, setLatestUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    async function refreshProfile() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const nextUser =
          (payload?.user ??
            payload?.data?.user ??
            payload?.data ??
            payload ??
            null) as AppUser | null;

        if (cancelled) {
          return;
        }

        setLatestUser(nextUser);
        if (nextUser) {
          setAuth(nextUser);
        }
      } catch {}
    }

    void refreshProfile();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, router, setAuth]);

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  const profileUser = latestUser ?? user;
  const displayName = profileUser?.name ?? profileUser?.email?.split("@")[0] ?? "Member";
  const profileFields = [
    { label: "Name", value: displayName },
    { label: "Email", value: profileUser?.email ?? "—" },
    { label: "Role", value: profileUser?.role ?? "CUSTOMER" },
    { label: "Status", value: profileUser?.isActive === false ? "SUSPENDED" : "ACTIVE" },
  ];

  return (
    <DashboardShell title="Account" accent="accent" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Profile</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Your account</h1>
      </div>

      {profileUser ? (
        <Card className="border border-border bg-surface">
          <CardContent className="space-y-3 p-6 text-sm text-ink-muted">
            {profileFields.map((field) => (
              <div key={field.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2">
                <span className="text-ink-muted">{field.label}</span>
                <span className="font-medium text-foreground">{field.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState title="No profile available" description="We could not load your profile details right now." />
      )}
    </DashboardShell>
  );
}
