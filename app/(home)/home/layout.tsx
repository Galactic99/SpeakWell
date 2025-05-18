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
  const isHomePath = pathname === "/home";
  const isFeedbackDetailPath = pathname?.includes("/home/feedbacks/") && pathname?.split("/").length > 3;
  const isFeedbacksPath = pathname === "/home/feedbacks";
  const isProgressPath = pathname === "/home/progress";
  const isConversationPath = pathname === "/home/conversations";

  return (
    <>
      {!isHomePath && !isProgressPath && !isConversationPath && <Navbar currentPath={pathname} />}
      <main className="flex-grow">{children}</main>
      {!isHomePath && !isFeedbackDetailPath && !isFeedbacksPath && !isProgressPath && !isConversationPath && <Footer />}
    </>
  );
} 