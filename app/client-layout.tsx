"use client";

import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePath = pathname?.endsWith("/home");

  return (
    <>
      {!isHomePath && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isHomePath && <Footer />}
    </>
  );
} 