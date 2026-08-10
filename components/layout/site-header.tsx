"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Moon, SunMedium, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { logout } from "@/services/auth";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { resolvedTheme, setTheme, mounted } = useTheme();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    try {
      await logout();
    } catch {
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

  const mobileLinkClasses =
    "block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-foreground";

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
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="border border-border bg-surface text-foreground md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

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
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button type="button" variant="secondary" size="sm" className="hidden md:inline-flex" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-border/80 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl space-y-1 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  mobileLinkClasses,
                  isAuthenticated && item.label === "Dashboard" && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-3 h-px bg-border" />
            {isAuthenticated ? (
              <>
                <p className="px-3 py-1 text-sm text-ink-muted">{user?.name ?? "Member"}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className={cn(mobileLinkClasses, "text-foreground")}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className={cn(mobileLinkClasses, "text-foreground")}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
