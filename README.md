# TP Tech Productions — Portfolio Website

> **Live**: https://Ryu169.github.io/Tech-Productions/

## Deploy ke GitHub Pages

Workflow GitHub Actions sudah disiapkan di `.github/workflows/deploy.yml`. Setiap kali Anda push ke branch `main`, site otomatis di-build dan di-publish ke Pages.

**Setup pertama kali (sekali saja):**

1. Push semua file ke `main` di repo `Ryu169/Tech-Productions`.
2. Buka repo di GitHub → **Settings** → **Pages**.
3. Pada bagian **Source**, pilih **GitHub Actions** (bukan "Deploy from a branch").
4. Buka tab **Actions** — workflow "Deploy to GitHub Pages" akan jalan otomatis.
5. Setelah selesai (~2 menit), site live di `https://Ryu169.github.io/Tech-Productions/`.

**Untuk update selanjutnya:**

```bash
git add .
git commit -m "update content"
git push
```

Push selesai → Actions otomatis re-deploy. Tidak perlu run command apapun di lokal.

**Manual trigger:** buka tab Actions di GitHub, pilih workflow, klik "Run workflow".

**Custom domain:** kalau nanti pakai domain sendiri (mis. `tptech.id`), edit `vite.config.js` ubah default `BASE` jadi `/`, edit `.github/workflows/deploy.yml` ubah env `VITE_BASE` jadi `/`, lalu setting Pages → Custom domain di GitHub Settings.

---


Single-page portfolio website untuk studio produk digital. Dibangun dengan **React + Vite + Tailwind CSS** dan dilengkapi sistem **CRUD berbasis localStorage** untuk Catalog dan Project (tanpa perlu backend).

## Fitur

- Sticky navbar dengan smooth-scroll & active section indicator
- Hero section dengan **fixed background image** dan WhatsApp CTA
- **Catalog**: grid kartu layanan dengan CRUD (tambah/edit/hapus)
- **Project**: grid kartu studi kasus dengan CRUD + upload gambar
- **About**: stats + nilai-nilai studio
- **Contact**: detail kontak + Google Maps embed + ikon sosial media
- **Floating WhatsApp button** di kanan bawah
- Mobile-first, fully responsive
- Mode Admin dengan toggle "lock/unlock" untuk mengaktifkan tombol CRUD

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser. Build production:

```bash
npm run build
npm run preview
```

## Kustomisasi

Semua identitas brand, kontak, dan seed data ada di satu file:

```
src/data/siteConfig.js
```

Edit `siteConfig.brand`, `whatsappNumber`, `email`, `address`, dan `social` sesuai kebutuhan Anda.

### Mengganti gambar hero

Letakkan gambar Anda di `public/hero-bg.jpg` (replace file yang ada). Resolusi minimum yang disarankan: **1920×1080**.

Jika ingin pakai filename lain, ubah path di `src/index.css`:

```css
.hero-bg {
  background-image:
    linear-gradient(...),
    url('/your-image-name.jpg');
}
```

## Mode Admin

Klik tombol **🔒 Admin** di pojok kanan atas section Catalog untuk masuk mode admin. Saat aktif, akan muncul tombol Edit/Hapus di setiap kartu, plus tombol "Tambah Layanan/Proyek" dan "Reset". Status admin disimpan di localStorage — refresh halaman tidak akan me-reset.

> **Catatan**: Karena seluruh data CRUD disimpan di localStorage browser, perubahan hanya berlaku di perangkat tersebut. Untuk multi-device atau kolaboratif, integrasikan ke backend (Supabase, Firebase, REST API, dll.) — strukturnya sudah modular.

## Struktur Folder

```
tp-tech-portfolio/
├── public/
│   ├── hero-bg.jpg        ← background hero (placeholder, ganti dengan foto Anda)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Catalog.jsx
│   │   ├── Projects.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Modal.jsx
│   │   └── WhatsAppFab.jsx
│   ├── data/siteConfig.js
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── AdminContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Stack

- **React 18** — UI library
- **Vite 5** — dev server & bundler
- **Tailwind CSS 3** — styling
- **lucide-react** — ikon

## License

Private. Untuk keperluan brand TP Tech Productions.
