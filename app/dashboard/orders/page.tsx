import { EmptyState } from "@/components/shared/empty-state";

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="mt-6">
        <EmptyState
          title="No orders yet"
          description="Your rental reservations will appear here once you start booking gear."
          actionLabel="Browse gear"
          href="/gear"
        />
      </div>
    </main>
  );
}
