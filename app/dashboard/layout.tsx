"use client";

import Navbar from "@/app/dashboard/_components/Navbar";
import Sidebar from "@/app/dashboard/_components/Sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-[#F6F6F6] h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 min-h-0 overflow-hidden ">
        <Sidebar />

        <main className="flex-1 rounded-[16px] p-3 lg:p-5 md:p-5   h-full flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
