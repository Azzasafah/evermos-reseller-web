"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { api, Alamat, Product, Transaction, Toko, Category } from "@/lib/api";
import {
  User,
  Store,
  MapPin,
  Package,
  Receipt,
  Plus,
  Trash2,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const { user, toko, token, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "profile" | "toko" | "alamat" | "products" | "transactions"
  >("profile");

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // States
  const [addresses, setAddresses] = useState<Alamat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Toko Update Form
  const [editTokoName, setEditTokoName] = useState("");
  const [tokoPhoto, setTokoPhoto] = useState<File | null>(null);

  // New Address Form
  const [newJudul, setNewJudul] = useState("");
  const [newPenerima, setNewPenerima] = useState("");
  const [newTelp, setNewTelp] = useState("");
  const [newDetail, setNewDetail] = useState("");

  // New Product Form
  const [prodNama, setProdNama] = useState("");
  const [prodCategory, setProdCategory] = useState<number>(1);
  const [prodReseller, setProdReseller] = useState("");
  const [prodKonsumen, setProdKonsumen] = useState("");
  const [prodStok, setProdStok] = useState("");
  const [prodDeskripsi, setProdDeskripsi] = useState("");
  const [prodPhotos, setProdPhotos] = useState<FileList | null>(null);

  useEffect(() => {
    if (!token && !user) {
      setAuthModalOpen(true);
    } else {
      if (toko) {
        setEditTokoName(toko.nama_toko);
      }
      loadAllData();
    }
  }, [token, user, toko]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [addrRes, trxRes, prodRes, catRes] = await Promise.all([
        api.alamat.getAll(),
        api.trx.getAll(),
        api.products.getAll({ limit: 50 }),
        api.categories.getAll(),
      ]);

      if (addrRes.data) setAddresses(addrRes.data);
      if (trxRes.data && trxRes.data.data) setTransactions(trxRes.data.data);
      if (prodRes.data && prodRes.data.data) {
        // filter products belonging to current user's toko
        if (toko) {
          setMyProducts(prodRes.data.data.filter((p) => p.toko?.id === toko.id));
        } else {
          setMyProducts(prodRes.data.data);
        }
      }
      if (catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0) setProdCategory(catRes.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 1. Update Toko
  const handleUpdateToko = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toko) return;
    setFeedback(null);
    setLoading(true);

    try {
      const fd = new FormData();
      if (editTokoName) fd.append("nama_toko", editTokoName);
      if (tokoPhoto) fd.append("photo", tokoPhoto);

      const res = await api.toko.updateToko(toko.id, fd);
      if (res.status) {
        setFeedback({ type: "success", text: "Profil toko berhasil diperbarui!" });
        await refreshUser();
      } else {
        setFeedback({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Gagal mengupdate toko" });
    } finally {
      setLoading(false);
    }
  };

  // 2. Create Address
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.alamat.create({
        judul_alamat: newJudul,
        nama_penerima: newPenerima,
        no_telp: newTelp,
        detail_alamat: newDetail,
      });
      if (res.status) {
        setFeedback({ type: "success", text: "Alamat pengiriman berhasil ditambahkan!" });
        setNewJudul("");
        setNewPenerima("");
        setNewTelp("");
        setNewDetail("");
        const addr = await api.alamat.getAll();
        if (addr.data) setAddresses(addr.data);
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Gagal membuat alamat" });
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Address
  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Hapus alamat ini?")) return;
    try {
      await api.alamat.delete(id);
      setAddresses(addresses.filter((a) => a.id !== id));
      setFeedback({ type: "success", text: "Alamat dihapus." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  // 4. Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("nama_produk", prodNama);
      fd.append("category_id", String(prodCategory));
      fd.append("harga_reseller", prodReseller);
      fd.append("harga_konsumen", prodKonsumen);
      fd.append("stok", prodStok);
      fd.append("deskripsi", prodDeskripsi);

      if (prodPhotos && prodPhotos.length > 0) {
        for (let i = 0; i < prodPhotos.length; i++) {
          fd.append("photos", prodPhotos[i]);
        }
      }

      const res = await api.products.create(fd);
      if (res.status) {
        setFeedback({ type: "success", text: "Produk baru berhasil ditambahkan ke toko!" });
        setProdNama("");
        setProdReseller("");
        setProdKonsumen("");
        setProdStok("");
        setProdDeskripsi("");
        setProdPhotos(null);
        await loadAllData();
      } else {
        setFeedback({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Gagal menambahkan produk" });
    } finally {
      setLoading(false);
    }
  };

  // 5. Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await api.products.delete(id);
      setMyProducts(myProducts.filter((p) => p.id !== id));
      setFeedback({ type: "success", text: "Produk berhasil dihapus." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} onOpenCart={() => {}} />
        <div className="pt-40 pb-20 text-center max-w-md mx-auto px-6">
          <Store className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">Akses Terbatas</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
            Silakan masuk atau buat akun baru untuk mengelola toko, alamat, dan melihat riwayat transaksi Anda.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-emerald-500 text-black font-bold text-xs"
          >
            Masuk / Daftar Akun
          </button>
        </div>
        <Footer />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar onOpenAuth={() => {}} onOpenCart={() => {}} />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="mb-8">
          <div className="text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-widest mb-1">
            Seller & Member Center
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-950 dark:text-white tracking-tight">
            Dashboard Manajemen Akun & Toko
          </h1>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between text-xs ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs underline">
              Tutup
            </button>
          </div>
        )}

        {/* Grid Layout: Sidebar Navigation & Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Tabs */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="double-bezel-shell p-2">
              <div className="double-bezel-core p-3 space-y-1">
                {[
                  { id: "profile", label: "Profil Pengguna", icon: User },
                  { id: "toko", label: "Kelola Toko Saya", icon: Store },
                  { id: "alamat", label: "Buku Alamat", icon: MapPin },
                  { id: "products", label: "Produk Toko", icon: Package },
                  { id: "transactions", label: "Riwayat Transaksi", icon: Receipt },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-emerald-500 text-black font-semibold shadow-md"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <section className="lg:col-span-9">
            <div className="double-bezel-shell">
              <div className="double-bezel-core p-6 sm:p-8">
                {/* 1. Tab: Profile */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white">
                      Informasi Akun Anda
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/5 space-y-1">
                        <span className="text-zinc-500 uppercase font-mono text-[10px]">
                          Nama Lengkap
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user.nama}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/5 space-y-1">
                        <span className="text-zinc-500 uppercase font-mono text-[10px]">
                          Nomor Telepon
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white font-mono">
                          {user.no_telp}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/5 space-y-1">
                        <span className="text-zinc-500 uppercase font-mono text-[10px]">
                          Email Terdaftar
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white font-mono">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/5 space-y-1">
                        <span className="text-zinc-500 uppercase font-mono text-[10px]">
                          Pekerjaan / Peran
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {user.pekerjaan || "Reseller"}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/5 space-y-1">
                        <span className="text-zinc-500 uppercase font-mono text-[10px]">
                          Provinsi
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {user.id_provinsi ? user.id_provinsi.name : "-"}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/5 space-y-1">
                        <span className="text-zinc-500 uppercase font-mono text-[10px]">
                          Kota / Kabupaten
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {user.id_kota ? user.id_kota.name : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Tab: Toko */}
                {activeTab === "toko" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white">
                      Pengaturan Toko Saya
                    </h3>
                    {toko ? (
                      <form onSubmit={handleUpdateToko} className="space-y-4 max-w-md">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xl text-emerald-600 dark:text-emerald-400 overflow-hidden relative">
                            {toko.url_foto ? (
                              <img
                                src={api.getImageUrl(toko.url_foto)}
                                alt={toko.nama_toko}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              toko.nama_toko.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 block mb-1">
                              Ganti Foto Profil Toko
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setTokoPhoto(e.target.files ? e.target.files[0] : null)
                              }
                              className="text-xs text-zinc-600 dark:text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-slate-200 dark:file:bg-white/10 file:text-zinc-900 dark:file:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Nama Toko
                          </label>
                          <input
                            type="text"
                            required
                            value={editTokoName}
                            onChange={(e) => setEditTokoName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          {loading ? "Menyimpan..." : "Simpan Perubahan Toko"}
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-zinc-500">Toko belum dimuat.</p>
                    )}
                  </div>
                )}

                {/* 3. Tab: Alamat */}
                {activeTab === "alamat" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white">
                      Buku Alamat Pengiriman
                    </h3>

                    {/* Existing Addresses List */}
                    <div className="space-y-3">
                      {addresses.length === 0 ? (
                        <p className="text-xs text-zinc-500">
                          Belum ada alamat tersimpan.
                        </p>
                      ) : (
                        addresses.map((a) => (
                          <div
                            key={a.id}
                            className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span>{a.judul_alamat}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  ({a.nama_penerima} - {a.no_telp})
                                </span>
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-400 mt-1">{a.detail_alamat}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(a.id)}
                              className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Form Add Address */}
                    <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                      <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono mb-3">
                        + Tambah Alamat Baru
                      </h4>
                      <form onSubmit={handleCreateAddress} className="space-y-3 max-w-lg text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                              Label Alamat
                            </label>
                            <input
                              type="text"
                              required
                              value={newJudul}
                              onChange={(e) => setNewJudul(e.target.value)}
                              placeholder="Rumah / Kantor"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                              Nama Penerima
                            </label>
                            <input
                              type="text"
                              required
                              value={newPenerima}
                              onChange={(e) => setNewPenerima(e.target.value)}
                              placeholder="Nama Penerima"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            No. Telepon
                          </label>
                          <input
                            type="text"
                            required
                            value={newTelp}
                            onChange={(e) => setNewTelp(e.target.value)}
                            placeholder="0812345678"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            Detail Alamat
                          </label>
                          <textarea
                            required
                            value={newDetail}
                            onChange={(e) => setNewDetail(e.target.value)}
                            placeholder="Jalan, No Rumah, RT/RW..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2 rounded-full bg-emerald-500 text-black font-semibold text-xs active:scale-95"
                        >
                          Simpan Alamat
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. Tab: Products */}
                {activeTab === "products" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white">
                      Katalog Produk Toko Saya
                    </h3>

                    {/* Existing Products */}
                    <div className="space-y-3">
                      {myProducts.length === 0 ? (
                        <p className="text-xs text-zinc-500">
                          Belum ada produk di tokomu. Buat produk pertamamu di bawah ini.
                        </p>
                      ) : (
                        myProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-zinc-950 overflow-hidden relative shrink-0">
                                <img
                                  src={
                                    p.photos && p.photos.length > 0
                                      ? api.getImageUrl(p.photos[0].url)
                                      : "https://picsum.photos/seed/" + p.id + "/200/200"
                                  }
                                  alt={p.nama_produk}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-zinc-900 dark:text-white">{p.nama_produk}</h4>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                                  Rp {p.harga_konsumen.toLocaleString("id-ID")} • Stok: {p.stok}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Product Form */}
                    <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                      <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono mb-3">
                        + Tambah Produk Baru ke Toko
                      </h4>
                      <form onSubmit={handleCreateProduct} className="space-y-3 max-w-lg text-xs">
                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            Nama Produk
                          </label>
                          <input
                            type="text"
                            required
                            value={prodNama}
                            onChange={(e) => setProdNama(e.target.value)}
                            placeholder="Contoh: Kemeja Flanel Casual"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                              Kategori
                            </label>
                            <select
                              value={prodCategory}
                              onChange={(e) => setProdCategory(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nama_category}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                              Stok Awal
                            </label>
                            <input
                              type="number"
                              required
                              value={prodStok}
                              onChange={(e) => setProdStok(e.target.value)}
                              placeholder="50"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                              Harga Reseller (Modal)
                            </label>
                            <input
                              type="number"
                              required
                              value={prodReseller}
                              onChange={(e) => setProdReseller(e.target.value)}
                              placeholder="350000"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                              Harga Konsumen (Jual)
                            </label>
                            <input
                              type="number"
                              required
                              value={prodKonsumen}
                              onChange={(e) => setProdKonsumen(e.target.value)}
                              placeholder="450000"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            Foto Produk (Multiple)
                          </label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setProdPhotos(e.target.files)}
                            className="text-xs text-zinc-600 dark:text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-slate-200 dark:file:bg-white/10 file:text-zinc-900 dark:file:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                            Deskripsi Produk
                          </label>
                          <textarea
                            value={prodDeskripsi}
                            onChange={(e) => setProdDeskripsi(e.target.value)}
                            placeholder="Jelaskan keunggulan dan detail bahan produk..."
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 rounded-full bg-emerald-500 text-black font-semibold text-xs active:scale-95"
                        >
                          Unggah Produk ke Toko
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5. Tab: Transactions */}
                {activeTab === "transactions" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white">
                      Riwayat Pesanan & Transaksi ({transactions.length})
                    </h3>

                    {transactions.length === 0 ? (
                      <p className="text-xs text-zinc-500">
                        Belum ada transaksi pembelian yang tercatat.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((trx) => (
                          <div
                            key={trx.id}
                            className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5 space-y-3 text-xs"
                          >
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/5">
                              <div>
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                  {trx.kode_invoice}
                                </span>
                                <span className="text-[11px] text-zinc-500 block font-mono">
                                  Metode Bayar: {trx.method_bayar.toUpperCase()}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-zinc-900 dark:text-white text-base">
                                Rp {trx.harga_total.toLocaleString("id-ID")}
                              </span>
                            </div>

                            {/* Detail items from log_produk */}
                            <div className="space-y-2">
                              {trx.detail_trx &&
                                trx.detail_trx.map((detail, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center text-zinc-700 dark:text-zinc-300"
                                  >
                                    <div className="truncate max-w-sm">
                                      <span className="font-medium text-zinc-900 dark:text-white">
                                        {detail.product ? detail.product.nama_produk : "Item"}
                                      </span>
                                      <span className="text-[11px] text-zinc-500 ml-2">
                                        x{detail.kuantitas}
                                      </span>
                                    </div>
                                    <span className="font-mono text-zinc-600 dark:text-zinc-400">
                                      Rp {detail.harga_total.toLocaleString("id-ID")}
                                    </span>
                                  </div>
                                ))}
                            </div>

                            {trx.alamat_kirim && (
                              <div className="pt-2 border-t border-slate-200/80 dark:border-white/5 text-[11px] text-zinc-500 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="truncate">
                                  Kirim ke: {trx.alamat_kirim.judul_alamat} (
                                  {trx.alamat_kirim.nama_penerima}) -{" "}
                                  {trx.alamat_kirim.detail_alamat}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
