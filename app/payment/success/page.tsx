import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold">Payment successful</h1>
      <p className="mt-4 text-muted-foreground">
        Your booking is confirmed and the provider has been notified.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">View orders</Link>
      </Button>
    </main>
  );
}
