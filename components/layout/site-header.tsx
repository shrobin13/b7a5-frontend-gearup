import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          GearUp
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/">Home</Link>
          <Link href="/gear">Gear</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
