import { DataTable } from "@/components/shared/data-table";

const orders = [
  { customer: "Amina", item: "Trail Pro Tent", status: "pending" },
  { customer: "Rahim", item: "Summit Pack", status: "approved" },
];

export default function ProviderOrdersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "customer", label: "Customer" },
            { key: "item", label: "Item" },
            { key: "status", label: "Status" },
          ]}
          data={orders}
        />
      </div>
    </main>
  );
}
