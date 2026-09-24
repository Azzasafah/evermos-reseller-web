# Evermos Reseller Social Commerce &mdash; Frontend Edition

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Motion-Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion">
  <img src="https://img.shields.io/badge/Design_System-Double_Bezel-10B981?style=for-the-badge" alt="Double Bezel">
  <img src="https://img.shields.io/badge/Architecture-App_Router-121212?style=for-the-badge" alt="App Router">
</p>

<br>

---

## 📌 Project Overview

This repository is the **Frontend Edition** of the flagship capstone project for the **Project-Based Internship: Rakamin Academy x Evermos (Backend & Fullstack Developer)**.

Engineered as a high-end web application companion to the **Go Clean Architecture RESTful API**, this client platform replicates the core user experience of **Evermos** &mdash; Indonesia's leading social commerce ecosystem empowering MSMEs (*UMKM*) and independent resellers to distribute halal products without holding physical inventory.

Built from the ground up using **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**, the platform provides an agency-grade user experience featuring a custom **Double-Bezel Architecture (*Doppelrand*)**, **Refractive Glassmorphism**, seamless **CSS variable-driven Dual Theming**, a live **Reseller Commission Simulator**, and a comprehensive **Seller & Member Center Dashboard**.

---

## 🚀 Key Frontend Architectural Highlights & Design System

- **Double-Bezel Component Architecture (*Doppelrand*)**:
  - Implemented layered contour nesting (`.double-bezel-shell` and `.double-bezel-core`) with realistic ambient depth, subtle inner glow, and smooth spring physics transitions for product cards and modals.
- **Refractive Glassmorphism**:
  - Floating pill navigation bar utilizing multi-stop backdrop blur (`backdrop-filter: blur(20px)`), frosted glass specular reflections, and responsive elevation shadows.
- **Seamless CSS Variable-Driven Dual Theming**:
  - Zero-FOUC (Flash of Unstyled Content) and zero-layout-shift theme switching between:
    - **Light Mode**: Warm, luxury off-white canvas (`#f8fafc`) with high-contrast slate typography (`text-zinc-950`).
    - **Dark Mode**: Deep OLED obsidian black canvas (`#09090b`) with crisp white typography (`text-zinc-100`) and emerald ambient radial glows.
  - Managed globally through `ThemeContext` with instant `localStorage` persistence and system color-scheme detection.
- **Fluid Micro-Interactions & Spring Motion**:
  - Interactive button hover physics, photo zoom transitions, and smooth dialog transitions powered by **Framer Motion** and **Lucide React**.
- **Typed API Client Abstraction Layer**:
  - A clean, decoupled client service (`src/lib/api.ts`) interfacing with the Go backend. Features automatic JWT session injection, multipart form-data serialization for image uploads, and normalized error handling.

---

## 🛠️ Feature Breakdown

### 1. 💰 Live Reseller Margin & Commission Simulator
- Interactive real-time calculator embedded directly in the hero section.
- Dynamically compares wholesale reseller prices (`harga_reseller`) against recommended consumer prices (`harga_konsumen`).
- Computes net profit per item on the fly, demonstrating immediate business value to prospective resellers.

### 2. 🛍️ Dynamic Product Discovery & Catalog
- **Instant Search**: Real-time filtering by product title without full page reloads.
- **Category Taxonomy Pills**: One-click category filtering (Fashion Muslim, Electronics, Halal Food, etc.).
- **Live Inventory Indicators**: Visual stock status pills (Available / Out of Stock) with color-coded badges.
- **Hover Quick Actions**: Smooth overlay buttons on product cards for quick preview and instant cart addition.

### 3. 🔍 High-Definition Product Detail Modal
- Multi-photo gallery carousel displaying high-resolution Unsplash photography.
- Store ownership attribution badge linking products to their originating merchant store.
- Itemized pricing economics showing wholesale base, consumer retail price, and reseller commission.
- Action triggers for both **"Beli Langsung"** (Direct Single Checkout) and **"Tambah ke Keranjang"**.

### 4. 🛒 Shopping Bag & Multi-Item Checkout Flow
- Client-side synchronized shopping cart state via `AuthContext`.
- **Integrated Address Book Selector**: Resellers can select from their saved shipping addresses during checkout.
- Automated payload dispatch to the backend `/trx` endpoint, generating order records, line items, and audit entries.

### 5. 🏪 Seller & Member Center Dashboard (`/dashboard`)
- **Profile Management**: Update personal reseller details (full name, phone, birth date, occupation, and bio).
- **Storefront Branding**: Customize store name and upload store banner/avatar (`multipart/form-data`).
- **Shipping Address Book**: Complete CRUD interface for managing multiple delivery addresses.
- **Store Inventory Manager**: Add new products with image uploads, wholesale pricing, retail pricing, stock counts, category tags, and descriptions.
- **Transaction History**: Comprehensive ledger tracking orders, invoice codes, items purchased, and total expenditure.

### 6. 🔐 Unified Authentication Modal
- Seamless modal dialog switching between Login and Registration workflows.
- Automatic digital storefront (`toko`) provisioning upon registration.
- Persistent session storage with automatic token attachment for subsequent requests.

---

## 🏛️ Component Architecture & Directory Structure

```
Evermos-FE/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Seller & Member Center portal (Tabs: Profile, Store, Alamat, Products, Trx)
│   │   ├── globals.css          # Design system tokens, double-bezel CSS, radial ambient glow
│   │   ├── layout.tsx           # Root layout with font optimization & dual-theme hydration
│   │   └── page.tsx             # Landing page, hero, margin calculator, filterable catalog
│   ├── components/
│   │   ├── AuthModal.tsx        # Responsive JWT login & registration dialog
│   │   ├── CheckoutModal.tsx    # Multi-item checkout & shipping address selector
│   │   ├── Footer.tsx           # Editorial footer with navigation links & copyright
│   │   ├── Navbar.tsx           # Floating glass pill navbar with theme switch & cart counter
│   │   ├── ProductCard.tsx      # Double-bezel product card with hover action overlays
│   │   └── ProductDetailModal.tsx # Product modal with multi-photo gallery carousel
│   ├── context/
│   │   ├── AuthContext.tsx      # Global auth state, user profile, cart, & token persistence
│   │   └── ThemeContext.tsx     # Light/Dark mode state management with localStorage sync
│   └── lib/
│       └── api.ts               # Typed API client wrapper communicating with Go RESTful backend
├── database/
│   ├── README.md                # Database initialization documentation
│   └── seeds/
│       ├── seed.sql             # SQL seed dataset (Users, Stores, Products, Trx)
│       └── seed_data.py         # Python automation runner
├── .env.example                 # Template environment variables
├── .gitignore                   # Git ignore rules for Next.js, TypeScript, and .agents
├── package.json                 # Project dependencies and npm scripts
├── tailwind.config.ts           # Tailwind CSS configuration with custom design tokens
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 📑 API Integration & Backend Mapping

The frontend communicates with the **Go Clean Architecture** backend running on port `8080`:

| Frontend Feature | UI Component | Backend Endpoint | HTTP Method |
| :--- | :--- | :--- | :---: |
| **User Login** | `AuthModal.tsx` | `/auth/login` | `POST` |
| **User Registration** | `AuthModal.tsx` | `/auth/register` | `POST` |
| **Profile Management** | `dashboard/page.tsx` | `/user` | `GET` / `PUT` |
| **Store Branding** | `dashboard/page.tsx` | `/toko/my` & `/toko/:id` | `GET` / `PUT` |
| **Product Discovery** | `ProductCard.tsx` | `/produk` & `/category` | `GET` |
| **Product Creation** | `dashboard/page.tsx` | `/produk` | `POST` |
| **Address Book CRUD** | `dashboard/page.tsx` | `/alamat` & `/alamat/:id` | `GET` / `POST` / `PUT` / `DELETE` |
| **Checkout & Orders** | `CheckoutModal.tsx` | `/trx` | `POST` |
| **Order History** | `dashboard/page.tsx` | `/trx` & `/trx/:id` | `GET` |

---

## 💻 Local Installation & Setup

### Prerequisites
- **Node.js** `>= 18.17.0` or `>= 20.x`
- **NPM** or **PNPM**
- **Go Backend Server** running on `http://localhost:8080` *(recommended)*

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Evermos-FE
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment template:
   ```bash
   cp .env.example .env.local
   ```
   Ensure the API URL points to your running Go backend:
   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: **`http://localhost:3000`**

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Default Seeded Credentials

Pre-configured accounts for testing full end-to-end commerce flows:

> **Universal Password:** `password123`

| Role | Phone Number (Login) | Password | Name | Store Name & Description |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `081234567890` | `password123` | Fajar Vibe | Fajar Vibe Official Store (Master Distributor) |
| **Reseller Pro** | `089876543210` | `password123` | Siti Reseller | Siti Hijab & Modest Wear (Bandung) |
| **Reseller Tech** | `081345678901` | `password123` | Ahmad Fauzi | Berkah Gadget & Living (Jakarta) |
| **Reseller Fashion**| `081567890123` | `password123` | Nurul Hidayah | Nurul Syari Collection (Surabaya) |

---

## 🎯 Engineering Standards & Accessibility

- **Design Integrity**: Agency-grade aesthetics avoiding generic component libraries. Custom CSS tokens for glassmorphism and double-bezel depth.
- **Accessible Contrast**: WCAG AA/AAA compliance across both Light Mode and Dark Mode palettes.
- **Strict Type Safety**: 100% typed TypeScript interfaces without `any` leaks in domain models.
- **Mobile First & Fully Responsive**: Optimized layouts from compact mobile screens (360px) to ultra-wide displays (4K).

---

## 📜 Attribution & License

- Frontend companion developed for the **Project-Based Internship: Rakamin Academy x Evermos (Backend & Fullstack Developer)**.
- Open-sourced under the [MIT License](LICENSE).
