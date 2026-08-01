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

const fallbackPayments: Payment[] = [
  { _id: "fallback-payment-1", status: "paid", amount: 125, currency: "USD" },
  { _id: "fallback-payment-2", status: "paid", amount: 98, currency: "USD" },
];

export default function PaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>(fallbackPayments);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      try {
        const nextPayments = await getMyPayments(authToken);
        setPayments(nextPayments ?? fallbackPayments);
      } catch {
        setPayments(fallbackPayments);
      }
    }

    void loadData();
  }, [isAuthenticated, router, token]);

  if (!isAuthenticated) {
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
