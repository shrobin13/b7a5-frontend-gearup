"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  href: string;
  label: string;
};

export function Sidebar({
  title,
  items,
  accent = "accent",
}: {
  title: string;
  items: SidebarItem[];
  accent?: "accent" | "pine" | "ink";
}) {
  const pathname = usePathname();

  const accentStyles = {
    accent: "text-accent hover:bg-accent-soft",
    pine: "text-pine hover:bg-pine-soft",
    ink: "text-foreground hover:bg-surface-muted",
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-surface p-4 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-6 px-2">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Workspace</p>
          <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-surface-muted text-foreground shadow-sm"
                    : `text-ink-muted ${accentStyles[accent]}`,
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
