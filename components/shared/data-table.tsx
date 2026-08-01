import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
}: {
  columns: { key: keyof T; label: string }[];
  data: T[];
}) {
  if (!data.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">No records found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-surface">
            {columns.map((column) => (
              <TableHead key={String(column.key)} className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="border-b border-border/80 last:border-b-0">
              {columns.map((column) => {
                const value = row[column.key];
                const cellValue = value ?? "-";

                return (
                  <TableCell key={String(column.key)} className="py-3 text-sm text-foreground">
                    {column.key === "status" && typeof cellValue === "string" ? (
                      <StatusBadge status={cellValue} />
                    ) : (
                      <span>{String(cellValue)}</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
