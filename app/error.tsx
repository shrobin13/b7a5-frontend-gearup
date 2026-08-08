"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">The app hit an unexpected error while loading this page.</p>
        <Button onClick={() => reset()} className="mt-6">
          Try again
        </Button>
      </div>
    </main>
  );
}
