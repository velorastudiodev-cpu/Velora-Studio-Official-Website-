# Velora Studio Dev — Official Website

Website resmi Velora Studio Dev: studio desain & software satu orang, dari sketsa sampai server.

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Motion · Zod.

## Menjalankan

```bash
npm install
npm run dev     # http://localhost:3000
```

## Pemeriksaan

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

## Deploy ke Vercel

1. Di vercel.com: **Add New → Project → Import** repo ini. Framework terdeteksi otomatis (Next.js), tidak ada setting build yang perlu diubah.
2. **Deploy.** Folder `website-screenshots/` tidak ikut diunggah (`.vercelignore`); gambar yang dipakai situs ada di `public/work/`.
3. Setelah punya domain sendiri, tambahkan di **Settings → Domains**, lalu isi env `NEXT_PUBLIC_SITE_URL=https://domainanda.com` dan redeploy, supaya canonical, sitemap, dan gambar OG memakai domain itu. Tanpa env ini dipakai URL produksi Vercel.

## Konfigurasi opsional

- `RESEND_API_KEY` — mengaktifkan form `/api/inquiry` (email ke velorastudiodev@gmail.com).
- `INQUIRY_FROM` — alamat pengirim terverifikasi di Resend.

Tanpa keduanya, brief proyek dikirim lewat WhatsApp dan email langsung.

## Untuk developer

Tekan `~` untuk terminal, `Ctrl+K` untuk menu perintah, `Alt+I` untuk membedah halaman.
