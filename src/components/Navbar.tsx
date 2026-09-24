"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ShoppingBag,
  User,
  Store,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export function Navbar({ onOpenAuth, onOpenCart }: NavbarProps) {
  const { user, toko, logout, cartItemCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-40 px-4 pointer-events-none">
        <nav className="max-w-5xl mx-auto pointer-events-auto">
          <div className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-2xl border border-slate-200/80 dark:border-white/10">
            {/* Logo & Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
                  Evermos{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono">
                    Reseller
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link
                href="/"
                className="hover:text-emerald-600 dark:hover:text-white transition-colors duration-200"
              >
                Katalog
              </Link>
              <Link
                href="/#kategori"
                className="hover:text-emerald-600 dark:hover:text-white transition-colors duration-200"
              >
                Kategori
              </Link>
              <Link
                href="/#toko"
                className="hover:text-emerald-600 dark:hover:text-white transition-colors duration-200"
              >
                Jaringan Toko
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="hover:text-emerald-500 transition-colors duration-200 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400/90"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Dashboard Saya</span>
                </Link>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Theme Toggle (Light / Dark) */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
                title={theme === "dark" ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300" />
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
                title="Keranjang Belanja"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black text-[11px] font-bold flex items-center justify-center font-mono animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User / Auth CTA */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-all text-sm text-zinc-800 dark:text-zinc-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-semibold">
                      {user.nama.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate text-xs font-medium">
                      {toko ? toko.nama_toko : user.nama}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-9 h-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/20 flex items-center justify-center transition-all"
                    title="Keluar"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-tight transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <span>Masuk / Daftar</span>
                  <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                    <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                  </div>
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-30 md:hidden glass-panel rounded-3xl p-6 border border-white/10 space-y-4"
          >
            <div className="flex flex-col gap-4 text-base font-medium text-zinc-300">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                Katalog Produk
              </Link>
              <Link
                href="/#kategori"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                Kategori
              </Link>
              <Link
                href="/#toko"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 transition-colors"
              >
                Jaringan Toko
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-emerald-400 font-semibold"
                >
                  Dashboard & Pesanan Saya
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-zinc-400 truncate max-w-[200px]">
                    {user.nama} ({user.email})
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-400 font-medium"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-emerald-500 text-black font-semibold text-sm text-center"
                >
                  Masuk / Daftar Akun
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
