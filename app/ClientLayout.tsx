"use client";

import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import type React from "react";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}
