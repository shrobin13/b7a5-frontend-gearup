
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GearUp",
  description: "Rent Sports & Outdoor Gear Instantly",
};

const AuthGroupLayout = async(
    {
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) => {
  return (
        <>
        <SiteHeader />
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        <SiteFooter />
        </>
  );
}

export default AuthGroupLayout;