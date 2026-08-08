"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CircleX, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cancelRental } from "@/services/customer";
import { getPaymentById } from "@/services/payment";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") ?? searchParams.get("payment_id") ?? "";
  const rentalId = searchParams.get("rentalId") ?? "";

  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cancelBooking() {
      let targetRentalId = rentalId;

      try {
        if (!targetRentalId && paymentId) {
          const payment = await getPaymentById(paymentId);
          const nested = (payment as { rentalOrder?: { id?: string; _id?: string } }).rentalOrder;
          targetRentalId = nested?.id ?? nested?._id ?? "";
        }

        if (targetRentalId) {
          await cancelRental(targetRentalId);
          setCancelled(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not cancel the rental");
      } finally {
        setLoading(false);
      }
    }

    void cancelBooking();
  }, [paymentId, rentalId]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Card className="border border-border bg-surface shadow-[0_18px_42px_rgba(26,36,32,0.05)]">
        <CardContent className="p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
            <CircleX className="h-8 w-8" />
          </div>

          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
            Checkout canceled
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Payment canceled
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
            Your checkout was canceled, but your cart is still here if you want
            to try again or adjust the dates.
          </p>

          {error ? (
            <p className="mt-6 text-sm text-destructive">{error}</p>
          ) : loading ? (
            <p className="mt-6 text-sm text-ink-muted">Cancelling your pending booking…</p>
          ) : cancelled ? (
            <p className="mt-6 text-sm text-ink-muted">
              Your pending booking has been cancelled.
            </p>
          ) : null}

          {paymentId && (
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-surface-muted p-4 text-left text-sm text-ink-muted">
              <div className="flex items-center gap-2 mb-3">
                <ReceiptText className="h-4 w-4 shrink-0" />
                <span className="font-medium text-ink">Cancellation details</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Payment ID</span>
                <span className="font-mono text-xs text-foreground break-all text-right max-w-[60%]">
                  {paymentId}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span>Status</span>
                {cancelled ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Cancelled
                  </span>
                ) : error ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {loading ? "Cancelling…" : "Cancellation failed"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {loading ? "Cancelling…" : "Checkout canceled"}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl bg-accent text-white hover:bg-accent/90">
              <Link href="/gear">Continue shopping</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border bg-background"
            >
              <Link href="/dashboard">
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return to dashboard
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}