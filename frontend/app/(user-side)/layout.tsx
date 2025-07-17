import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import React from "react";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import {Toaster} from "@/components/ui/sonner";

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

export default function UserLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen min-h-screen`}
    >
    <SidebarProvider>
      <AppSidebar/>
      <main className={'w-full h-full'}>
        <SidebarTrigger/>
        {children}
      </main>
      <Toaster richColors/>
    </SidebarProvider>
    </body>
    </html>
  );
}
