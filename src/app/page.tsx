"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { AuthModal } from "@/components/AuthModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useAuth } from "@/context/AuthContext";
import { api, Product, Category, Toko } from "@/lib/api";
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Store,
  Layers,
  ChevronRight,
  CheckCircle,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, addToCart, cart } = useAuth();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tokos, setTokos] = useState<Toko[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
    loadTokos();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, page]);

  const loadCategories = async () => {
    try {
      const res = await api.categories.getAll();
      if (res.status && res.data) {
        setCategories(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadTokos = async () => {
    try {
      const res = await api.toko.getAll({ limit: 4 });
      if (res.status && res.data && res.data.data) {
        setTokos(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.getAll({
        page,
        limit: 12,
        nama_produk: searchQuery,
        category_id: selectedCategory,
      });
      if (res.status && res.data && res.data.data) {
        setProducts(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Checkout directly for single product
  const handleCheckoutDirect = (product: Product, quantity: number) => {
    setDetailProduct(null);
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setCheckoutItems([{ product, quantity }]);
    setCheckoutModalOpen(true);
  };

  // Open checkout for current cart
  const handleOpenCartCheckout = () => {
    if (cart.length === 0) return;
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setCheckoutItems(cart);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="relative">
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCart={handleOpenCartCheckout}
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Lead Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pemberdayaan Ekonomi Reseller Nusantara</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.08]">
              Raih Mandiri Finansial dengan{" "}
              <span className="text-emerald-600 dark:text-emerald-400 italic font-serif">Katalog Halal</span> & Komisi Transparan.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              Jual ribuan produk UMKM pilihan langsung tanpa stok barang fisik. Toko otomatis terbuat saat daftar, terhubung ke sistem pengiriman 34 provinsi.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (user) {
                    window.location.href = "/dashboard";
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
                className="group relative inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm tracking-tight transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
              >
                <span>{user ? "Buka Toko Saya" : "Mulai Jadi Reseller"}</span>
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </div>
              </button>

              <a
                href="#katalog"
                className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-all"
              >
                Jelajahi Produk
              </a>
            </div>

            {/* Live Metrics Strip */}
            <div className="pt-8 border-t border-slate-200 dark:border-white/5 grid grid-cols-3 gap-6">
              <div>
                <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white block">
                  34
                </span>
                <span className="text-xs text-zinc-500">Provinsi Terjangkau</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                  100%
                </span>
                <span className="text-xs text-zinc-500">Halal & Amanah</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white block">
                  Rp 0
                </span>
                <span className="text-xs text-zinc-500">Modal Awal Daftar</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual (Asymmetrical Feature Spotlight Card) */}
          <div className="lg:col-span-5 relative">
            <div className="double-bezel-shell">
              <div className="double-bezel-core p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 tracking-wider">
                      Simulasi Margin Reseller
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Calculator
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 space-y-2">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Harga Grosir Reseller</span>
                      <span className="font-mono text-zinc-900 dark:text-white font-medium">Rp 350.000</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Harga Rekomendasi Konsumen</span>
                      <span className="font-mono text-zinc-900 dark:text-white font-medium">Rp 450.000</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Keuntungan Bersih per Item
                      </span>
                      <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        +Rp 100.000
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Otomatis tersimpan di <strong className="text-zinc-900 dark:text-white">log_produk</strong> saat transaksi sukses dibuat.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!user) setAuthModalOpen(true);
                      else window.location.href = "/dashboard";
                    }}
                    className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-zinc-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold tracking-tight transition-all text-center"
                  >
                    Buka Toko & Dapatkan Margin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Strip */}
      <section id="kategori" className="py-8 border-y border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === ""
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-slate-200 dark:border-white/5 shadow-sm"
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(String(c.id))}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === String(c.id)
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-slate-200 dark:border-white/5 shadow-sm"
              }`}
            >
              {c.nama_category}
            </button>
          ))}
        </div>
      </section>

      {/* Catalog & Search Section */}
      <section id="katalog" className="py-20 px-6 max-w-7xl mx-auto">
        {/* Section Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Katalog Terverifikasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
              Pilihan Produk Reseller
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk apa saja..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="double-bezel-shell h-80 animate-pulse bg-slate-200/50 dark:bg-white/5"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-8 bg-white/50 dark:bg-transparent">
            <Package className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
              Belum ada produk yang cocok
            </h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Coba ganti kata kunci pencarian atau kategori lain di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetail={(p) => setDetailProduct(p)}
                onAddToCart={(p) => addToCart(p, 1)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Toko Network Section */}
      {tokos.length > 0 && (
        <section id="toko" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-widest mb-1">
                Jaringan Terpercaya
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                Toko Mitra Reseller Aktif
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {tokos.length} Toko Tampil
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tokos.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 shadow-sm transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                  {t.nama_toko.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {t.nama_toko}
                  </h4>
                  <span className="text-xs text-zinc-500">Mitra Terverifikasi</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onCheckoutDirect={handleCheckoutDirect}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        items={checkoutItems}
        onOrderSuccess={(invoice) => {
          loadProducts(); // refresh stock
        }}
      />
    </div>
  );
}
