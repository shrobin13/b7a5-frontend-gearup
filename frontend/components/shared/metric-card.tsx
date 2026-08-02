import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  detail,
  tone = "accent",
}: {
  title: string;
  value: string;
  detail: string;
  tone?: "accent" | "pine" | "ink";
}) {
  const toneStyles = {
    accent: "bg-accent-soft text-accent border-accent/20",
    pine: "bg-pine-soft text-pine border-pine/20",
    ink: "bg-surface-muted text-foreground border-border",
  };

  return (
    <Card className={`border ${toneStyles[tone]}`}>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{title}</p>
        <p className="mt-4 font-display text-3xl leading-none text-foreground">{value}</p>
        <p className="mt-2 text-sm text-ink-muted">{detail}</p>
      </CardContent>
    </Card>
  );
}
