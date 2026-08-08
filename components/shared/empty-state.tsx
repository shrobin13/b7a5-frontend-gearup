import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && href ? (
        <Button asChild className="mt-6">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
