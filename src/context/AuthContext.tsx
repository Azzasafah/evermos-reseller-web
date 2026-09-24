"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, Product, Toko, UserProfile } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AuthContextType {
  user: UserProfile | null;
  toko: Toko | null;
  token: string | null;
  isLoading: boolean;
  login: (no_telp: string, kata_sandi: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toko, setToko] = useState<Toko | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("evermos_token");
    if (savedToken) {
      setToken(savedToken);
      loadUserProfile();
    } else {
      setIsLoading(false);
    }

    const savedCart = localStorage.getItem("evermos_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.user.getProfile();
      if (res.status && res.data) {
        setUser(res.data);
        // Load my toko
        const tokoRes = await api.toko.getMyToko();
        if (tokoRes.status && tokoRes.data) {
          setToko(tokoRes.data);
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error("Auth check failed", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (no_telp: string, kata_sandi: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ no_telp, kata_sandi });
      if (res.status && res.data && res.data.token) {
        localStorage.setItem("evermos_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data);
        // Load Toko
        const tokoRes = await api.toko.getMyToko();
        if (tokoRes.status && tokoRes.data) {
          setToko(tokoRes.data);
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("evermos_token");
    setToken(null);
    setUser(null);
    setToko(null);
  };

  const refreshUser = async () => {
    await loadUserProfile();
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      localStorage.setItem("evermos_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem("evermos_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("evermos_cart");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.harga_konsumen * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthContext.Provider
      value={{
        user,
        toko,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
