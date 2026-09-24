"use client";

import React from "react";
import Image from "next/image";
import { Product, api } from "@/lib/api";
import { Store, Tag, ShoppingBag, Eye, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  onViewDetail,
  onAddToCart,
}: ProductCardProps) {
  const imageUrl =
    product.photos && product.photos.length > 0
      ? api.getImageUrl(product.photos[0].url)
      : "https://picsum.photos/seed/" + product.id + "/600/600";

  const profitMargin = product.harga_konsumen - product.harga_reseler;

  return (
    <div className="double-bezel-shell group hover:scale-[1.01] transition-transform duration-500">
      <div className="double-bezel-core p-4 flex flex-col justify-between h-full relative overflow-hidden">
        {/* Top Image Frame */}
        <div className="relative w-full aspect-square rounded-[calc(2rem-0.65rem)] overflow-hidden bg-slate-100 dark:bg-zinc-950 mb-4 border border-slate-200/60 dark:border-white/5">
          <Image
            src={imageUrl}
            alt={product.nama_produk}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Category Pill Tag */}
          {product.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-[10px] uppercase font-mono tracking-wider text-zinc-800 dark:text-zinc-300 shadow-sm">
              {product.category.nama_category}
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.stok > 0 ? "bg-emerald-500 dark:bg-emerald-400" : "bg-red-500"
              }`}
            />
            <span className={product.stok > 0 ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
              {product.stok > 0 ? `${product.stok} Stok` : "Habis"}
            </span>
          </div>

          {/* Quick Action Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => onViewDetail(product)}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center transition-all shadow-lg active:scale-95"
              title="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stok <= 0}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50"
              title="Tambah ke Keranjang"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content & Metadata */}
        <div>
          {/* Toko Name */}
          {product.toko && (
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1.5">
              <Store className="w-3 h-3 text-zinc-400" />
              <span className="truncate">{product.toko.nama_toko}</span>
            </div>
          )}

          {/* Product Title */}
          <h3
            onClick={() => onViewDetail(product)}
            className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight line-clamp-1 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
          >
            {product.nama_produk}
          </h3>

          {/* Pricing Details */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block font-mono">
                Harga Konsumen
              </span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                Rp {product.harga_konsumen.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Profit margin badge */}
            {profitMargin > 0 && (
              <div className="text-right">
                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block font-mono">
                  Margin Komisi
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  +Rp {profitMargin.toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            onClick={() => onViewDetail(product)}
            className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white flex items-center justify-between transition-all group/btn active:scale-98"
          >
            <span>Beli / Detail Produk</span>
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200">
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-800 dark:text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
