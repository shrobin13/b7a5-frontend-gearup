import { EmptyState } from "@/components/shared/empty-state";

export default function PaymentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Payments</h1>
      <div className="mt-6">
        <EmptyState
          title="No payment history"
          description="Completed charges and checkout receipts will appear here."
          actionLabel="Browse gear"
          href="/gear"
        />
      </div>
    </main>
  );
}
