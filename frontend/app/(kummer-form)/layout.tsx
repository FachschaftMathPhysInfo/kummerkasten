import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React from "react";
import {Footer} from "@/components/footer";
import {Toaster} from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kummerkasten",
  description: "Kummerkasten der Fachschaft",
  keywords: ["kummerkasten", "fachschaft", "mathphysinfo", "uni heidelberg"]
};

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen min-h-screen`}
      >
        {children}
      <Footer />
      <Toaster richColors/>
      </body>
    </html>
  );
}
