
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
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default AuthGroupLayout;