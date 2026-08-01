export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© 2026 GearUp</p>
        <div className="flex gap-4">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/gear">Browse gear</a>
        </div>
      </div>
    </footer>
  );
}
