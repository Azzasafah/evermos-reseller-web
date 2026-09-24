"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { X, Store, Tag, ShoppingBag, ArrowRight, Check, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onCheckoutDirect: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onCheckoutDirect,
}: ProductDetailModalProps) {
  const { addToCart } = useAuth();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const photos =
    product.photos && product.photos.length > 0
      ? product.photos.map((p) => api.getImageUrl(p.url))
      : ["https://picsum.photos/seed/" + product.id + "/800/800"];

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl double-bezel-shell"
        >
          <div className="double-bezel-core p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left: Gallery */}
              <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200/80 dark:border-white/5">
                  <Image
                    src={photos[selectedPhotoIndex] || photos[0]}
                    alt={product.nama_produk}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnails */}
                {photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedPhotoIndex === idx
                            ? "border-emerald-500 scale-95"
                            : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={url} alt="Thumb" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info & Purchase */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Category & Toko */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {product.category && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400">
                        {product.category.nama_category}
                      </span>
                    )}
                    {product.toko && (
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <Store className="w-3.5 h-3.5" />
                        <span>{product.toko.nama_toko}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">
                    {product.nama_produk}
                  </h1>

                  {/* Pricing */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Harga Konsumen</span>
                      <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        Rp {product.harga_konsumen.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400">
                      <span>Harga Reseller</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-300 font-medium">
                        Rp {product.harga_reseler.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Ketersediaan Stok</span>
                    <span className="font-semibold text-zinc-900 dark:text-white font-mono">
                      {product.stok > 0 ? `${product.stok} unit tersedia` : "Stok Habis"}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Deskripsi Produk</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-h-36 overflow-y-auto pr-1">
                      {product.deskripsi || "Tidak ada deskripsi rinci untuk produk ini."}
                    </p>
                  </div>
                </div>

                {/* Purchase Controls */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 space-y-3">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Jumlah Pembelian</span>
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full px-3 py-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stok || 99, q + 1))
                        }
                        className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleAdd}
                      disabled={product.stok <= 0}
                      className="py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-zinc-800 dark:text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Dimasukkan!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>+ Keranjang</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onCheckoutDirect(product, quantity)}
                      disabled={product.stok <= 0}
                      className="py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <span>Beli Langsung</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
