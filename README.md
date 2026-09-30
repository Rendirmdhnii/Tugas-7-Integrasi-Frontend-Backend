# Tugas #7: Integrasi Frontend & Backend

Aplikasi Todo List fullstack yang mengintegrasikan **Backend (Express.js, TypeScript, MySQL)** dan **Frontend (Next.js 15, TypeScript, Tailwind CSS)** dengan sistem otentikasi JWT.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, MySQL (`mysql2`), JWT, Bcrypt
- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS

---

## ⚡ Cara Menjalankan

### 1. Database Setup
Import skrip database di MySQL:
```sql
-- Jalankan file backend/schema.sql di MySQL server Anda
SOURCE backend/schema.sql;
```

### 2. Jalankan Backend
```bash
cd backend
npm install
npm run dev
```
Server berjalan di `http://localhost:5000`.

### 3. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi dapat diakses di `http://localhost:3000`.

---

## 📌 Fitur Utama

- **Otentikasi**: Registrasi & Login menggunakan JWT (token disimpan di LocalStorage).
- **CRUD Todo**:
  - Menambah tugas baru.
  - Mengubah status tugas (selesai/belum selesai).
  - Menghapus tugas.
  - Filter tugas (Semua, Belum Selesai, Selesai).
- **Halaman Detail**: Menampilkan rincian tugas berdasarkan ID (`/task/[id]`).
- **Auth Guard**: Proteksi halaman utama dan detail untuk pengguna yang telah terotentikasi.
