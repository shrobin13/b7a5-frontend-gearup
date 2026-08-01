import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "approved" || status === "active" || status === "paid"
      ? "default"
      : status === "pending" || status === "processing"
        ? "secondary"
        : status === "cancelled" || status === "inactive"
          ? "destructive"
          : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}
