import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/provider/inventory", label: "Inventory" },
  { href: "/provider/orders", label: "Provider Orders" },
  { href: "/provider/add-gear", label: "Add Gear" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear Moderation" },
  { href: "/admin/rentals", label: "Rentals" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card p-4 lg:block">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
