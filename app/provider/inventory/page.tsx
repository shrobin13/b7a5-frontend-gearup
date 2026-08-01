import { DataTable } from "@/components/shared/data-table";

const inventory = [
  { name: "Trail Pro Tent", stock: 4, price: "$28/day", status: "active" },
  { name: "Summit Pack", stock: 7, price: "$18/day", status: "active" },
];

export default function ProviderInventoryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "name", label: "Gear" },
            { key: "stock", label: "Stock" },
            { key: "price", label: "Price" },
            { key: "status", label: "Status" },
          ]}
          data={inventory}
        />
      </div>
    </main>
  );
}
