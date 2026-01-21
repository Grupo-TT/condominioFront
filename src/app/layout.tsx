// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { MobileDeviceWarning } from "@/components/MobileDeviceWarning";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Aplicación para la administración de condominios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <MobileDeviceWarning />
        </AuthProvider>
        <Toaster position="top-right" style={{ width: '400px' }} />
      </body>
    </html>
  );
}


