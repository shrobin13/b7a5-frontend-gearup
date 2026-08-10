import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Rental order lifecycle color coding:
 * PLACED → amber, CONFIRMED → blue, PAID → violet,
 * PICKED_UP → green, RETURNED → gray, CANCELLED → red.
 */
const STATUS_STYLES: Record<string, string> = {
  placed: "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400",
  confirmed:
    "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400",
  paid: "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-400",
  picked_up:
    "border-green-200 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400",
  "picked-up":
    "border-green-200 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400",
  "picked up":
    "border-green-200 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400",
  returned:
    "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-500/30 dark:bg-zinc-500/15 dark:text-zinc-400",
  cancelled:
    "border-red-200 bg-red-100 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400",
  // Generic states used across dashboards
  pending:
    "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400",
  processing:
    "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400",
  active:
    "border-green-200 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400",
  approved:
    "border-green-200 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400",
  success:
    "border-green-200 bg-green-100 text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400",
  inactive: "border-border bg-surface-muted text-ink-muted",
  failed: "border-red-200 bg-red-100 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400",
  refunded:
    "border-red-200 bg-red-100 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const normalized = status?.toLowerCase() ?? "pending";
  const style = STATUS_STYLES[normalized] ?? "border-border bg-surface-muted text-ink-muted";

  return (
    <Badge variant="outline" className={cn(style, className)}>
      {status}
    </Badge>
  );
}
