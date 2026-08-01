import { DataTable } from "@/components/shared/data-table";

const users = [
  { name: "Ahsan", email: "ahsan@example.com", role: "CUSTOMER", status: "active" },
  { name: "Nadia", email: "nadia@example.com", role: "PROVIDER", status: "active" },
  { name: "Admin", email: "admin@gearup.com", role: "ADMIN", status: "active" },
];

export default function AdminUsersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
          ]}
          data={users}
        />
      </div>
    </main>
  );
}
