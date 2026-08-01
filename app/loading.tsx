import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-12">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-xl" />
        ))}
      </div>
    </main>
  );
}
