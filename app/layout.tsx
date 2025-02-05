import "./globals.css";
import { Dancing_Script, Kalam } from "next/font/google";
import ClientLayout from "./ClientLayout";
import type React from "react";

const handwriting = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-handwriting",
});

const cursive = Dancing_Script({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cursive",
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
      <body
        className={`${handwriting.variable} ${cursive.variable} font-handwriting`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
