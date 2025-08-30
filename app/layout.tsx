import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ToastProvider} from '@/components/toast-provider'
import { Providers } from "./providers";
import Header from "@/components/Header"
import {Footer} from "@/components/Footer"



export const metadata: Metadata = {
  title: "Vinx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className="bg-gray-50 "
      >
        <Providers>
       
        {children}
    
        </Providers>
        <ToastProvider/>
      </body>
    </html>
  );
}
