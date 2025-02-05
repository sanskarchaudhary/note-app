import "./globals.css";
import { Kalam, Caveat, Indie_Flower } from "next/font/google";
import ClientLayout from "./ClientLayout";
import type React from "react";

const handwriting = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-handwriting",
});

const cursive = Caveat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cursive",
});

const casual = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-casual",
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
        className={`${handwriting.variable} ${cursive.variable} ${casual.variable} font-handwriting`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
