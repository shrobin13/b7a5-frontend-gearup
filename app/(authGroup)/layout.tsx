
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GearUp",
  description: "Rent Sports & Outdoor Gear Instantly",
};

const AuthGroupLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="w-full max-w-md space-y-4">
            <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-surface-muted" />
            <div className="h-6 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-surface-muted" />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default AuthGroupLayout;