import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Evermos Reseller Commerce — Platform Pemberdayaan Ekonomi Umat",
  description:
    "Ekosistem social commerce reseller terlengkap di Indonesia dengan katalog produk halal, margin komisi transparan, dan teknologi Go Clean Architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased bg-background text-zinc-900 dark:text-zinc-100 min-h-[100dvh] flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="flex-1 bg-ambient-radial">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
