import { DataTable } from "@/components/shared/data-table";

const gear = [
  { name: "Trail Pro Tent", provider: "North Peak", status: "pending" },
  { name: "Glide Bike", provider: "City Ride", status: "approved" },
];

export default function AdminGearPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Gear moderation</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "name", label: "Gear" },
            { key: "provider", label: "Provider" },
            { key: "status", label: "Status" },
          ]}
          data={gear}
        />
      </div>
    </main>
  );
}
