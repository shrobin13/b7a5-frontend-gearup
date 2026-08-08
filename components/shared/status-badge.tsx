import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() ?? "pending";
  const variant =
    normalized === "approved" || normalized === "active" || normalized === "paid"
      ? "default"
      : normalized === "pending" || normalized === "processing"
        ? "secondary"
        : normalized === "cancelled" || normalized === "inactive"
          ? "destructive"
          : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}
