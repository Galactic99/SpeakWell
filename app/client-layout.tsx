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
  const isSessionPath = pathname?.includes("/session/");
  const isFeedbacksPath = pathname === "/home/feedbacks";
  const isFeedbackDetailPath = pathname?.includes("/home/feedbacks/") && pathname?.split("/").length > 3;
  const isProgressPath = pathname === "/home/progress";
  const isInFeedbackSection = isFeedbacksPath || isFeedbackDetailPath;

  return (
    <>
      {!isHomePath && !isSessionPath && !isInFeedbackSection && !isProgressPath && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isHomePath && !isSessionPath && !isInFeedbackSection && !isProgressPath && <Footer />}
    </>
  );
} 