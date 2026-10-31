# 🚗 DriveEase — Fleet Management & Vehicle Rental System
> **Sistem Informasi Rental Kendaraan & Manajemen Armada Modern**  
> Dibangun dengan arsitektur decoupled: Frontend React 19 + TypeScript + Vite + Tailwind CSS v4, dan Backend Laravel REST API + MySQL.

---

## 📋 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Hak Akses & Role (RBAC)](#-hak-akses--role-rbac)
3. [Tech Stack](#-tech-stack)
4. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
5. [Instalasi & Menjalankan Lokal](#-instalasi--menjalankan-lokal)
6. [Panduan Deployment Vercel (Frontend)](#-panduan-deployment-vercel-frontend)
7. [Panduan Deployment Backend Laravel & MySQL](#-panduan-deployment-backend-laravel--mysql)
8. [Akun Demo untuk Pengujian](#-akun-demo-untuk-pengujian)

---

## ✨ Fitur Utama

- **Customer Portal**:
  - Katalog kendaraan interaktif dengan filter multi-kriteria (kategori, transmisi, kapasitas, rentang harga, ketersediaan).
  - Quick Booking modal dengan kalkulasi biaya real-time (durasi sewa, opsi supir, diskon, deposit DP 30%).
  - Sistem **Anti-Double Booking** pencegahan tabrakan tanggal sewa.
  - Upload bukti pembayaran (DP / Pelunasan) & verifikasi status.
  - Riwayat sewa & status pengembalian.
- **Admin Dashboard**:
  - Statistik & KPI: Total armada, unit disewa, pendapatan bulanan, booking aktif, unit maintenance.
  - Grafik pendapatan interaktif (*Recharts*) dengan mode Area & Bar chart.
  - **Manajemen Armada (CRUD)**: Tambah unit, edit tarif/spesifikasi, hapus, filter status.
  - **Manajemen Pelanggan (CRUD)**: Kelola data penyewa, riwayat booking, verifikasi KTP/SIM.
  - **Approval Booking**: Konfirmasi atau tolak pesanan, fitur reschedule tanggal.
  - **Manajemen Pembayaran**: Verifikasi bukti transfer bank, pelunasan di kasir.
  - **Check-in Pengembalian**: Kalkulasi denda otomatis (keterlambatan/jam, denda BBM, biaya kerusakan fisik).
  - **Jadwal & Riwayat Maintenance**: Tracking bengkel berkala & sinkronisasi status unit otomatis.
  - **Laporan Komprehensif**: 6 jenis laporan bisnis, filter rentang tanggal, export data ke Excel/CSV & cetak PDF.
- **Petugas Rental (Staff) Portal**:
  - Checklist serah terima kendaraan (Handover) & inspeksi kondisi fisik awal.
  - Checklist penerimaan kembali (Check-in return) & kalkulasi denda instan.
  - SOP panduan operasional staf lapangan.

---

## 👥 Hak Akses & Role (RBAC)

1. **Admin**: Akses penuh ke seluruh manajemen operasional, laporan keuangan, konfigurasi armada, dan pelanggan.
2. **Petugas Rental (Staff)**: Fokus pada alur operasional serah terima kunci (handover), inspeksi pengembalian fisik, dan cek denda.
3. **Customer**: Akses katalog, reservasi, upload bukti pembayaran, dan monitoring status sewa.

---

## 🛠️ Tech Stack

### Frontend (`/driveease`)
- **React 19** + **TypeScript**
- **Vite 8** + **@tailwindcss/vite (Tailwind CSS v4)**
- **React Router DOM v7**
- **Lucide React** (Modern iconography)
- **Recharts** (Interactive data visualization)
- **Axios** (REST API Client dengan interceptor token Sanctum)

### Backend (`/backend`)
- **PHP 8+** & **Laravel REST API**
- **Laravel Sanctum** (Bearer Token Authentication)
- **MySQL Database** (12 tabel berelasi + Foreign Keys + Index + Seeders)

---

## 📁 Struktur Direktori Proyek

```
DRIVEEASE/
├── backend/
│   ├── app/Http/Controllers/    # Auth, Vehicle, Booking, Payment, Return Controllers
│   ├── database/
│   │   └── driveease_schema.sql # Skema DDL 12 Tabel MySQL + Seeders
│   ├── routes/
│   │   └── api.php              # RESTful API Endpoints terproteksi Sanctum
│   └── .env.example
├── driveease/                   # Frontend Vite + React + TypeScript
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, Customer & Admin components
│   │   ├── layouts/             # AdminLayout, StaffLayout
│   │   ├── pages/               # Customer, Auth, Admin, Staff pages
│   │   ├── services/            # Axios API client, Storage state layer & Mock data
│   │   ├── types/               # TypeScript definitions
│   │   ├── utils/               # Formatters (IDR, tanggal) & Export helpers (CSV/PDF)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vercel.json              # Vercel SPA routing rewrite config
│   ├── vite.config.ts           # Code splitting & Tailwind setup
│   └── package.json
├── .gitignore                   # Root ignore filter
└── README.md
```

---

## 🚀 Instalasi & Menjalankan Lokal

### 1. Menjalankan Frontend
```bash
cd driveease
npm install
npm run dev
```
Buka browser pada: `http://localhost:5173`

### 2. Menjalankan Backend Laravel
```bash
cd backend
# Buat database 'driveease_db' di MySQL / phpMyAdmin
# Import file: backend/database/driveease_schema.sql
php artisan serve
```
Backend berjalan pada: `http://localhost:8000`

---

## ☁️ Panduan Deployment Vercel (Frontend)

DriveEase telah dikonfigurasi agar dapat langsung di-deploy ke **Vercel** secara gratis dan instan:

1. **Push ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete driveease vehicle rental system"
   git push origin main
   ```
2. **Import ke Vercel**:
   - Buka [vercel.com](https://vercel.com/) dan login menggunakan akun GitHub Anda.
   - Klik **Add New...** -> **Project**.
   - Pilih repository **DRIVEEASE**.
3. **Konfigurasi Project Settings di Vercel**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Klik **Edit** dan pilih folder `driveease`
   - **Build Command**: `npm run build` (atau biarkan default)
   - **Output Directory**: `dist` (default)
4. **Environment Variables**:
   - Tambahkan variabel:
     - `VITE_API_BASE_URL` = `https://api-driveease.yourdomain.com/api` (atau biarkan default jika menggunakan mode hybrid storage)
5. **Deploy**:
   - Klik tombol **Deploy**. Vercel akan mem-build project dalam ~30 detik.
   - SPA routing telah ditangani oleh file `vercel.json` sehingga URL refresh tidak menghasilkan error 404.

---

## 🌐 Panduan Deployment Backend Laravel & MySQL

Untuk menghubungkan data MySQL secara online:

1. **Database MySQL**:
   - Gunakan layanan cloud seperti **Railway**, **Aiven**, **PlanetScale**, atau cPanel hosting.
   - Buka phpMyAdmin / MySQL CLI dan jalankan file SQL:
     ```
     backend/database/driveease_schema.sql
     ```
2. **Deploy Laravel API**:
   - Dapat di-host di VPS (DigitalOcean / AWS / Linode) atau PaaS (Railway / Render / Heroku).
   - Set konfigurasi `.env` Laravel dengan kredensial database online Anda.
   - Pastikan header CORS diizinkan untuk domain Vercel Anda (`APP_URL` & `config/cors.php`).
3. **Hubungkan Frontend**:
   - Ubah `VITE_API_BASE_URL` di Environment Variables Vercel ke URL API Laravel online Anda.

---

## 🔑 Akun Demo untuk Pengujian

Gunakan tombol **1-Click Demo Login** pada halaman Login atau gunakan kredensial berikut:

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@driveease.id` | `admin123` | Akses penuh dashboard, armada, pelanggan, finance, laporan |
| **Petugas (Staff)** | `petugas@driveease.id` | `staff123` | Checklist serah terima, pengembalian, inspeksi fisik |
| **Customer** | `customer@driveease.id` | `customer123` | Katalog mobil, booking sewa, upload bukti transfer |

---

© 2026 DriveEase Indonesia. All rights reserved.
