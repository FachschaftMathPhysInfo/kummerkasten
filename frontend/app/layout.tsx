import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import {UserSidebar, UserSidebarTrigger} from "@/components/user-sidebar";
import {Toaster} from "@/components/ui/sonner";
import {UserProvider} from "@/components/providers/user-provider";
import {Footer} from "@/components/footer";

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
    <UserProvider>
      <SidebarProvider>
          <UserSidebar/>
          <main className={'w-full h-full'}>
            <UserSidebarTrigger/>
            {children}
            <Footer />
          </main>
          <Toaster richColors/>
      </SidebarProvider>
    </UserProvider>
    </body>
    </html>
  );
}
