import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© 2026 GearUp</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
          <Link href="/gear" className="transition-colors hover:text-foreground">
            Browse gear
          </Link>
        </div>
      </div>
    </footer>
  );
}
