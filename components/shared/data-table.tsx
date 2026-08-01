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
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>{String(row[column.key] ?? "-")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
