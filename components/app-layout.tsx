"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-8 pt-0">{children}</main>
    </div>
  );
}
