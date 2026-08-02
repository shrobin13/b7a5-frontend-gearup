"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { getMyPayments } from "@/services/customer";
import { useAuthStore } from "@/store/auth-store";
import type { Payment } from "@/types";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/profile", label: "Profile" },
];


export default function PaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    async function loadData() {
      try {
        const nextPayments = await getMyPayments();
        setPayments(nextPayments ?? []);
      } catch {
        setPayments([]);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell title="Account" accent="accent" items={sidebarItems}>
      <div className="mb-8">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Payments</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Payment history</h1>
      </div>

      <DataTable
        columns={[
          { key: "status", label: "Status" },
          { key: "amount", label: "Amount" },
          { key: "currency", label: "Currency" },
        ]}
        data={payments.map((payment) => ({
          ...payment,
          amount: payment.amount ? `$${payment.amount}` : "—",
          currency: payment.currency ?? "USD",
        }))}
      />
    </DashboardShell>
  );
}
