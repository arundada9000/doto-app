import type { Metadata } from "next";
import { Suspense } from "react";
import { AppProvider } from "@/providers/AppProvider";
import { AppShell } from "@/components/layout/AppShell";

/**
 * These routes render only the person's own data, held on their device. There
 * is nothing here for a crawler to find, so they are kept out of the index
 * rather than surfacing an empty shell in search results.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Suspense>
        <AppShell>{children}</AppShell>
      </Suspense>
    </AppProvider>
  );
}
