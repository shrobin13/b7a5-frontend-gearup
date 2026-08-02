"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { logout } from "@/services/auth";

export function SiteHeader() {
  const { resolvedTheme, setTheme, mounted } = useTheme();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // proceed with local clear even if the API call fails
    } finally {
      clearAuth();
      router.push("/");
      router.refresh();
    }
  }

  const isDarkMode = mounted && resolvedTheme === "dark";

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "PROVIDER"
        ? "/provider"
        : "/dashboard";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/gear", label: "Browse Gear" },
    { href: "/about", label: "How it works" },
    { href: dashboardHref, label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-display text-white shadow-sm">
            G
          </span>
          <span className="font-display text-xl uppercase tracking-[0.08em]">GearUp</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle color mode"
            className="border border-border bg-surface text-foreground"
            onClick={mounted ? () => setTheme(isDarkMode ? "light" : "dark") : undefined}
            disabled={!mounted}
          >
            {mounted ? (isDarkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <span className="h-4 w-4" />}
          </Button>

          {isAuthenticated ? (
            <>
              <span className="hidden text-sm font-medium text-foreground md:inline-block">
                {user?.name ?? "Member"}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
