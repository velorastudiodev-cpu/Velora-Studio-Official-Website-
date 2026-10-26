import { z } from "zod";
import { ProjectSchema } from "@/lib/schemas";

// Copy and figures follow the live sites (screenshots in /website-screenshots). Figures quoted from a
// client's own site are marked as such in their labels; stacks are the owner's own listing.
const seed = [
  {
    id: "VEL-001",
    title: {
      id: "DINASTI Barbershop — Website barbershop keluarga di Luragung, Kuningan",
      en: "DINASTI Barbershop — Website for a family barbershop in Luragung, Kuningan",
    },
    slug: "dinasti-barbershop",
    categoryBadge: { id: "Website brand & konsultasi", en: "Brand & consultation website" },
    tagline: {
      id: "Hasil potongan, layanan dan harga, lokasi dan jam buka, lalu konsultasi langsung lewat WhatsApp.",
      en: "Finished cuts, services and prices, location and hours, then a direct WhatsApp consultation.",
    },
    clientOrDomain: { id: "Barbershop, Luragung, Kuningan", en: "Barbershop, Luragung, Kuningan" },
    soloFounderRole: "Product Designer · Website Engineer · Web Developer",
    pillars: ["UI_UX_DESIGN", "WEBSITE_ENGINEERING", "WEB_DEVELOPMENT"],
    status: "LIVE_ECOSYSTEM",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Framer Motion"],
    problemStatement: {
      id: "Barbershop keluarga yang berdiri sejak 2024 butuh tempat online untuk menunjukkan hasil potongannya, dan cara mudah bagi pelanggan baru untuk bertanya sebelum datang.",
      en: "A family barbershop founded in 2024 needed a place online to show its cuts, and an easy way for new customers to ask before they walk in.",
    },
    engineeringSolution: {
      id: "Website satu halaman dengan galeri foto dan video hasil potongan, profil barber, daftar layanan dan harga, lokasi serta jam buka, dan tombol konsultasi WhatsApp di setiap bagian. Tampilan dirancang terpisah untuk desktop, tablet, dan HP.",
      en: "A one-page site with a photo and video gallery of finished cuts, the barber’s profile, services and prices, location and hours, and a WhatsApp consultation button in every section. Laid out separately for desktop, tablet and phone.",
    },
    metrics: [
      { label: { id: "Berdiri", en: "Founded" }, value: "2024" },
      { label: { id: "Pelanggan puas, menurut situsnya", en: "Happy customers, per the site" }, value: "500+" },
      { label: { id: "Konsultasi", en: "Consultation" }, value: "WhatsApp" },
      { label: { id: "Ukuran layar dirancang", en: "Screen sizes designed" }, value: "3" },
    ],
    links: { liveDemo: "https://ikbar-barbershop.vercel.app" },
  },
  {
    id: "VEL-002",
    title: {
      id: "Dashboard Admin — Panel pengelola untuk DINASTI Barbershop",
      en: "Admin Dashboard — The back office for DINASTI Barbershop",
    },
    slug: "dinasti-dashboard",
    categoryBadge: { id: "Dashboard admin", en: "Admin dashboard" },
    tagline: {
      id: "Ruang kerja pribadi pemilik barbershop, dikunci dengan login Google dan hanya bisa dibuka olehnya.",
      en: "The barbershop owner’s private workspace, locked behind Google sign-in and open to him alone.",
    },
    clientOrDomain: { id: "Barbershop, ruang admin", en: "Barbershop, back office" },
    soloFounderRole: "Product Designer · Full-Stack Developer · Software Developer",
    pillars: ["UI_UX_DESIGN", "WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"],
    status: "LIVE_ECOSYSTEM",
    stack: ["Next.js App Router", "TypeScript", "Google Sign-In", "PostgreSQL"],
    problemStatement: {
      id: "Website DINASTI butuh dapur: tempat pemilik mengelola usahanya tanpa membuka akses ke orang lain.",
      en: "The DINASTI website needed a back room: somewhere the owner runs the business without opening access to anyone else.",
    },
    engineeringSolution: {
      id: "Dashboard terpisah dengan login Google dan akses yang dibatasi ke satu akun pemilik.",
      en: "A separate dashboard with Google sign-in and access restricted to the owner’s single account.",
    },
    metrics: [
      { label: { id: "Masuk dengan", en: "Sign-in" }, value: "Google" },
      { label: { id: "Akun yang bisa masuk", en: "Accounts that can sign in" }, value: "1" },
      { label: { id: "Melayani", en: "Serves" }, value: "VEL-001" },
      { label: { id: "Status", en: "Status" }, value: "Live" },
    ],
    links: { liveDemo: "https://ikbar-barbershop-5rx3.vercel.app/dashboard" },
  },
  {
    id: "VEL-003",
    title: {
      id: "Dzikri Mountain Guide — Guide & porter pendakian Gunung Ciremai",
      en: "Dzikri Mountain Guide — Hiking guide & porter for Mount Ciremai",
    },
    slug: "dzikri-mountain-guide",
    categoryBadge: { id: "Website booking jasa", en: "Service booking website" },
    tagline: {
      id: "Guide lokal Ciremai, Papandayan, Prau, dan Merbabu. Hitung biaya trip di halaman, lalu booking lewat WhatsApp.",
      en: "A local guide for Ciremai, Papandayan, Prau and Merbabu. Work out the trip cost on the page, then book on WhatsApp.",
    },
    clientOrDomain: { id: "Pendakian, Gunung Ciremai", en: "Hiking, Mount Ciremai" },
    soloFounderRole: "Product Designer · Website Engineer · Web Developer · Software Developer",
    pillars: ["UI_UX_DESIGN", "WEBSITE_ENGINEERING", "WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"],
    status: "PRODUCTION",
    stack: ["Next.js 15", "TypeScript", "Zod", "WhatsApp deep links"],
    problemStatement: {
      id: "Pendaki ingin tahu biaya dan jadwal sebelum berangkat, tapi biasanya harus tanya-tanya dulu lewat chat.",
      en: "Hikers want the cost and dates before they commit, but usually have to ask back and forth in chat first.",
    },
    engineeringSolution: {
      id: "Website dengan kalkulator biaya trip (paket, layanan, durasi, tanggal), tabel paket per gunung, galeri pendakian, FAQ, dan booking lewat WhatsApp dengan DP 30% via transfer atau QRIS.",
      en: "A site with a trip cost calculator (package, service, length, date), a package table per mountain, a hiking gallery, FAQ, and WhatsApp booking with a 30% deposit by transfer or QRIS.",
    },
    metrics: [
      { label: { id: "Gunung dilayani", en: "Mountains served" }, value: "4" },
      { label: { id: "Mulai dari, per orang", en: "From, per person" }, value: "Rp250.000" },
      { label: { id: "DP untuk booking", en: "Booking deposit" }, value: "30%" },
      { label: { id: "Tahun memandu di Ciremai", en: "Years guiding on Ciremai" }, value: "2" },
    ],
    links: { liveDemo: "https://dzikri-mount-guide.vercel.app" },
  },
] satisfies z.input<typeof ProjectSchema>[];

export const projects = z.array(ProjectSchema).length(3).parse(seed);
