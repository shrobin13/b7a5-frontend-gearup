"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { confirmPayment, getPaymentById } from "@/services/payment";
import type { Payment } from "@/types";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") ?? searchParams.get("payment_id") ?? "";
  const rentalId = searchParams.get("rentalId") ?? "";

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayment() {
      setLoading(true);
      setError(null);

      try {
        if (paymentId) {
          const nextPayment = await getPaymentById(paymentId);
          setPayment(nextPayment);
        }

        if (paymentId || rentalId) {
          await confirmPayment({ paymentId, rentalOrderId: rentalId });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load payment details");
      } finally {
        setLoading(false);
      }
    }

    void loadPayment();
  }, [paymentId, rentalId]);

  const gearName = (payment as { gear?: { name?: string } } | null)?.gear?.name ?? "Your rental";
  const amount = payment?.amount ? `$${payment.amount}` : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Card className="border border-border bg-surface shadow-[0_18px_42px_rgba(26,36,32,0.05)]">
        <CardContent className="p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pine-soft text-pine">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-pine">Reservation confirmed</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">Payment successful</h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
            Your booking is confirmed and the provider has been notified. A receipt has been sent to your email.
          </p>

          {loading ? (
            <p className="mt-8 text-sm text-ink-muted">Loading payment details…</p>
          ) : error ? (
            <p className="mt-8 text-sm text-destructive">{error}</p>
          ) : (
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-surface-muted p-4 text-left text-sm text-ink-muted">
              <div className="flex items-center justify-between gap-3">
                <span>{gearName}</span>
                <span className="font-mono text-foreground">{amount ?? "—"}</span>
              </div>
              {payment?.status ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span>Status</span>
                  <span className="font-mono text-foreground">{payment.status}</span>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-muted">
            <ShieldCheck className="h-4 w-4 text-pine" />
            Secure checkout · verified pickup details
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl bg-pine text-white hover:bg-pine/90">
              <Link href="/dashboard">View orders</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-border bg-background">
              <Link href="/gear">Browse more gear</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}