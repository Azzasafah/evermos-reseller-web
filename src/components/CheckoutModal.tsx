"use client";

import React, { useState, useEffect } from "react";
import { Product, Alamat, api } from "@/lib/api";
import { useAuth, CartItem } from "@/context/AuthContext";
import {
  X,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (invoiceCode: string) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}: CheckoutModalProps) {
  const { user, clearCart } = useAuth();
  const [addresses, setAddresses] = useState<Alamat[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("bca");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInvoice, setSuccessInvoice] = useState<string | null>(null);

  // New Address inline form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [judulAlamat, setJudulAlamat] = useState("Rumah");
  const [namaPenerima, setNamaPenerima] = useState(user?.nama || "");
  const [noTelp, setNoTelp] = useState(user?.no_telp || "");
  const [detailAlamat, setDetailAlamat] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadAddresses();
    }
  }, [isOpen, user]);

  const loadAddresses = async () => {
    try {
      const res = await api.alamat.getAll();
      if (res.status && res.data) {
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddressId(res.data[0].id);
        } else {
          setShowAddAddress(true);
        }
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await api.alamat.create({
        judul_alamat: judulAlamat,
        nama_penerima: namaPenerima,
        no_telp: noTelp,
        detail_alamat: detailAlamat,
      });
      if (res.status && res.data) {
        setShowAddAddress(false);
        await loadAddresses();
        setSelectedAddressId(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan alamat");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleProcessCheckout = async () => {
    if (!selectedAddressId) {
      setError("Silakan pilih atau tambahkan alamat pengiriman terlebih dahulu.");
      return;
    }

    if (items.length === 0) {
      setError("Keranjang belanja kosong.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        method_bayar: paymentMethod,
        alamat_kirim: selectedAddressId,
        detail_trx: items.map((item) => ({
          product_id: item.product.id,
          kuantitas: item.quantity,
        })),
      };

      const res = await api.trx.create(payload);
      if (res.status) {
        const trxId = res.data;
        // Fetch created transaction for invoice code
        const trxDetail = await api.trx.getById(trxId);
        const invoice = trxDetail.data ? trxDetail.data.kode_invoice : `INV-${Date.now()}`;
        setSuccessInvoice(invoice);
        clearCart();
        onOrderSuccess(invoice);
      } else {
        setError(res.errors ? res.errors.join(", ") : res.message);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memproses transaksi");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.harga_konsumen * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl double-bezel-shell"
        >
          <div className="double-bezel-core p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Penyelesaian Pesanan</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success State */}
            {successInvoice ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-zinc-950 dark:text-white">
                  Transaksi Berhasil Dibuat!
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                  Stok produk telah dipotong otomatis dan data pesanan tersimpan ke riwayat log produk.
                </p>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 inline-block font-mono text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                  Invoice: {successInvoice}
                </div>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-emerald-500 text-black font-semibold text-xs tracking-tight shadow-lg shadow-emerald-500/20"
                  >
                    Tutup & Lihat Pesanan
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <div className="space-y-6">
                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Items Summary */}
                <div>
                  <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono mb-3">
                    Ringkasan Item ({items.length})
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5 text-xs"
                      >
                        <div className="truncate max-w-[240px]">
                          <p className="font-semibold text-zinc-900 dark:text-white truncate">
                            {item.product.nama_produk}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                            {item.quantity} x Rp{" "}
                            {item.product.harga_konsumen.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          Rp{" "}
                          {(
                            item.product.harga_konsumen * item.quantity
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Alamat Pengiriman</span>
                    </h4>
                    {!showAddAddress && (
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(true)}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Alamat Baru</span>
                      </button>
                    )}
                  </div>

                  {showAddAddress ? (
                    <form
                      onSubmit={handleSaveAddress}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-emerald-500/30 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            Label Alamat
                          </label>
                          <input
                            type="text"
                            required
                            value={judulAlamat}
                            onChange={(e) => setJudulAlamat(e.target.value)}
                            placeholder="Rumah / Kantor"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-zinc-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            Nama Penerima
                          </label>
                          <input
                            type="text"
                            required
                            value={namaPenerima}
                            onChange={(e) => setNamaPenerima(e.target.value)}
                            placeholder="Nama Lengkap"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-zinc-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                          No. Telepon Penerima
                        </label>
                        <input
                          type="text"
                          required
                          value={noTelp}
                          onChange={(e) => setNoTelp(e.target.value)}
                          placeholder="0812345678"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-zinc-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                          Alamat Lengkap (Jalan, RT/RW, Kecamatan)
                        </label>
                        <textarea
                          required
                          value={detailAlamat}
                          onChange={(e) => setDetailAlamat(e.target.value)}
                          placeholder="Jl. Merdeka No. 10..."
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-zinc-900 dark:text-white"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={savingAddress}
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold"
                        >
                          {savingAddress ? "Menyimpan..." : "Simpan Alamat"}
                        </button>
                      </div>
                    </form>
                  ) : addresses.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Belum ada alamat tersimpan. Klik "+ Alamat Baru" di atas.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex items-center justify-between ${
                            selectedAddressId === addr.id
                              ? "bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-white shadow-sm"
                              : "bg-slate-50 dark:bg-zinc-900/40 border-slate-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/20"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                              <span>{addr.judul_alamat}</span>
                              <span className="text-[10px] text-zinc-500 font-normal">
                                ({addr.nama_penerima} - {addr.no_telp})
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-sm">
                              {addr.detail_alamat}
                            </p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedAddressId === addr.id
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-slate-300 dark:border-zinc-600"
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Metode Pembayaran</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "bca", name: "BCA Virtual Account" },
                      { id: "mandiri", name: "Mandiri Bill" },
                      { id: "qris", name: "QRIS Instant" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                          paymentMethod === method.id
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-sm"
                            : "bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 text-zinc-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/10"
                        }`}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Total & Submit */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono block">
                      Total Tagihan
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    onClick={handleProcessCheckout}
                    disabled={loading || items.length === 0}
                    className="py-3 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Bayar Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
