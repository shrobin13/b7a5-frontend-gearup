import { DataTable } from "@/components/shared/data-table";

const rentals = [
  { id: "R-101", customer: "Ahsan", total: "$84", status: "active" },
  { id: "R-102", customer: "Nadia", total: "$42", status: "completed" },
];

export default function AdminRentalsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Rentals</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
          ]}
          data={rentals}
        />
      </div>
    </main>
  );
}
