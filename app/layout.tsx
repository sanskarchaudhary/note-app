import "./globals.css";
import { Kalam } from "next/font/google";
import ClientLayout from "./ClientLayout";
import type React from "react";

const handwriting = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Note App with Themes",
  description: "A note-taking app with customizable themes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={handwriting.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
