import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold">Payment canceled</h1>
      <p className="mt-4 text-muted-foreground">
        Your checkout was canceled. You can try again at any time.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/gear">Continue shopping</Link>
      </Button>
    </main>
  );
}
