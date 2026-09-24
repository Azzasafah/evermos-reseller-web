"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { X, Sparkles, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Login
  const [noTelp, setNoTelp] = useState("");
  const [kataSandi, setKataSandi] = useState("");

  // Form Register
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pekerjaan, setPekerjaan] = useState("Reseller");
  const [tanggalLahir, setTanggalLahir] = useState("02/01/2000");
  const [idProvinsi, setIdProvinsi] = useState("");
  const [idKota, setIdKota] = useState("");

  // Region Data
  const [provinces, setProvinces] = useState<Array<{ id: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (tab === "register") {
      api.provcity.getProvinces().then((res) => {
        if (res.data) {
          setProvinces(res.data);
          if (res.data.length > 0) {
            setIdProvinsi(res.data[0].id);
          }
        }
      });
    }
  }, [tab]);

  useEffect(() => {
    if (idProvinsi) {
      api.provcity.getCities(idProvinsi).then((res) => {
        if (res.data) {
          setCities(res.data);
          if (res.data.length > 0) {
            setIdKota(res.data[0].id);
          }
        }
      });
    }
  }, [idProvinsi]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await login(noTelp, kataSandi);
      if (ok) {
        onClose();
      } else {
        setError("Nomor telepon atau kata sandi tidak cocok");
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await api.auth.register({
        nama,
        kata_sandi: kataSandi,
        no_telp: noTelp,
        email,
        tanggal_Lahir: tanggalLahir,
        pekerjaan,
        id_provinsi: idProvinsi,
        id_kota: idKota,
      });

      if (res.status) {
        setSuccess("Registrasi berhasil! Toko otomatis terbuat. Silakan login.");
        setTimeout(() => {
          setTab("login");
          setSuccess(null);
        }, 1500);
      } else {
        setError(res.errors ? res.errors.join(", ") : res.message);
      }
    } catch (err: any) {
      setError(err.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg double-bezel-shell"
        >
          <div className="double-bezel-core p-8 relative overflow-hidden">
            {/* Header Close */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evermos Gateway</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Tabs */}
            <h2 className="text-2xl font-display font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
              {tab === "login" ? "Selamat Datang Kembali" : "Gabung Komunitas Reseller"}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
              {tab === "login"
                ? "Kelola tokomu, katalog produk, dan transaksi dalam satu dashboard."
                : "Toko langsung aktif otomatis begitu registrasi berhasil!"}
            </p>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-full transition-all ${
                  tab === "login"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-full transition-all ${
                  tab === "register"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            {tab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={noTelp}
                    onChange={(e) => setNoTelp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    value={kataSandi}
                    onChange={(e) => setKataSandi(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Masuk Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Quick Demo Accounts */}
                <div className="pt-4 mt-2 border-t border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span>Atau isi otomatis akun demo (1-klik):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNoTelp("081234567890");
                        setKataSandi("password123");
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-500/10 dark:bg-white/5 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-left transition-all group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          Demo Admin
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
                          Admin
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        081234567890
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNoTelp("089876543210");
                        setKataSandi("password123");
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-500/10 dark:bg-white/5 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-left transition-all group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          Demo Reseller
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
                          User
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        089876543210
                      </p>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      No. Telepon
                    </label>
                    <input
                      type="text"
                      required
                      value={noTelp}
                      onChange={(e) => setNoTelp(e.target.value)}
                      placeholder="0812345678"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="anda@mail.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      value={pekerjaan}
                      onChange={(e) => setPekerjaan(e.target.value)}
                      placeholder="Developer / Reseller"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Tgl. Lahir
                    </label>
                    <input
                      type="text"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Provinsi
                    </label>
                    <select
                      value={idProvinsi}
                      onChange={(e) => setIdProvinsi(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Kota / Kabupaten
                    </label>
                    <select
                      value={idKota}
                      onChange={(e) => setIdKota(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    value={kataSandi}
                    onChange={(e) => setKataSandi(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Daftar & Buat Toko Otomatis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
