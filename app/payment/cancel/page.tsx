import Link from "next/link";
import { ArrowLeft, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Card className="border border-border bg-surface shadow-[0_18px_42px_rgba(26,36,32,0.05)]">
        <CardContent className="p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
            <CircleX className="h-8 w-8" />
          </div>

          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Checkout canceled</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">Payment canceled</h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
            Your checkout was canceled, but your cart is still here if you want to try again or adjust the dates.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl bg-accent text-white hover:bg-accent/90">
              <Link href="/gear">Continue shopping</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-border bg-background">
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
