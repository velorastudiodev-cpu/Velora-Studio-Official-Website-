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

## Konfigurasi opsional

- `RESEND_API_KEY` — mengaktifkan form `/api/inquiry` (email ke velorastudiodev@gmail.com).
- `INQUIRY_FROM` — alamat pengirim terverifikasi di Resend.

Tanpa keduanya, brief proyek dikirim lewat WhatsApp dan email langsung.

## Untuk developer

Tekan `~` untuk terminal, `Ctrl+K` untuk menu perintah, `Alt+I` untuk membedah halaman.
