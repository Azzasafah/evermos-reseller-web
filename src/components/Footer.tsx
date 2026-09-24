import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, Truck, Headphones } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-zinc-950/80 relative overflow-hidden transition-colors">
      {/* Trust strip */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-slate-200 dark:border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">100% Produk Halal</h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Terverifikasi & terpercaya</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">Margin Reseller Adil</h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Komisi menguntungkan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">Kirim Seluruh Nusantara</h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Jangkauan 34 provinsi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">Dukungan Komunitas</h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Bimbingan reseller aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-lg text-zinc-900 dark:text-white">Evermos Social Commerce</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Platform pemberdayaan ekonomi umat berbasis ekosistem reseller dan UMKM lokal Indonesia. Terintegrasi penuh dengan REST API Golang & Clean Architecture.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-xs">
          <div>
            <h5 className="font-mono text-zinc-800 dark:text-zinc-300 font-semibold uppercase tracking-wider mb-3">
              Platform
            </h5>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Katalog Reseller</Link></li>
              <li><Link href="/#kategori" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kategori Produk</Link></li>
              <li><Link href="/#toko" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Jaringan Toko</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dashboard Seller</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-zinc-800 dark:text-zinc-300 font-semibold uppercase tracking-wider mb-3">
              Developer
            </h5>
            <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
              <li><span>Golang 1.27 + Gin</span></li>
              <li><span>MySQL + GORM</span></li>
              <li><span>JWT Authentication</span></li>
              <li><span>Next.js 15 App Router</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-zinc-800 dark:text-zinc-300 font-semibold uppercase tracking-wider mb-3">
              Status Server
            </h5>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">API :8080 Online</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">
              Rakamin Virtual Internship Experience
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-white/5 py-6 text-center text-xs text-zinc-500 dark:text-zinc-600 font-mono">
        &copy; {new Date().getFullYear()} Evermos Ecosystem. Built with Pride and Clean Architecture.
      </div>
    </footer>
  );
}
