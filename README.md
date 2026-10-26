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

## Keamanan

Kontrol yang terpasang (diuji di `src/app/api/inquiry/route.test.ts` dan pemeriksaan header pada build produksi):

- **Content-Security-Policy ketat dengan nonce per request** (`src/middleware.ts`): hanya script ber-nonce yang jalan, `strict-dynamic`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`.
- **Header**: HSTS (2 tahun, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (kamera, mikrofon, lokasi, pembayaran, USB mati), `Cross-Origin-Opener-Policy`. `X-Powered-By` dimatikan.
- **Halaman hanya menerima GET/HEAD**; method lain 405.
- **`/api/inquiry`**: hanya dari origin situs sendiri (403), hanya JSON (415), body maks 10 kB (413), rate limit 5 per 10 menit per IP (429), validasi Zod, honeypot anti-bot, subjek email dibersihkan dari baris baru, respons error tidak membocorkan detail skema.
- **Tanpa input pengguna di HTML**: JSON-LD di-escape, teks CLI dirender sebagai teks, pesan WhatsApp di-encode.
- **Image optimizer** hanya untuk gambar lokal (tidak bisa dipakai SSRF).
- **Dependensi**: `npm audit` 0 kerentanan (`postcss` bawaan Next dipaksa ke versi yang sudah ditambal lewat `overrides`).
- **Rahasia**: tidak ada kunci di repo; `.env*` diabaikan git. `RESEND_API_KEY` hanya di env Vercel.

Catatan untuk pentester: rate limit `/api/inquiry` disimpan di memori per instance (cukup selama form belum aktif); method `TRACE` ditolak oleh edge Vercel sebelum sampai ke aplikasi. Dashboard admin DINASTI adalah aplikasi terpisah dan tidak termasuk repo ini.

## Untuk developer

Tekan `~` untuk terminal, `Ctrl+K` untuk menu perintah, `Alt+I` untuk membedah halaman.
