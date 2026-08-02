import { Sidebar, type SidebarItem } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";

export function DashboardShell({
  title,
  accent,
  items,
  children,
}: {
  title: string;
  accent?: "accent" | "pine" | "ink";
  items: SidebarItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
      <Sidebar title={title} items={items} accent={accent} />

      <main className="min-w-0 flex-1">
        <Card className="border border-border bg-surface p-1 shadow-[0_18px_42px_rgba(26,36,32,0.04)]">
          <div className="rounded-[1.5rem] bg-background p-4 md:p-6">{children}</div>
        </Card>
      </main>
    </div>
  );
}
