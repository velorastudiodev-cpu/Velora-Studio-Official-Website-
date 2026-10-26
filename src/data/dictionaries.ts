import type { Locale, LocalizedText } from "@/lib/schemas";

const seed = {
  // Navigation
  "nav.studio": { id: "Studio", en: "Studio" },
  "nav.work": { id: "Karya", en: "Work" },
  "nav.how": { id: "Cara kerja", en: "How I work" },
  "nav.plan": { id: "Rancang", en: "Plan" },
  "nav.chat": { id: "Chat di WhatsApp", en: "Chat on WhatsApp" },
  "nav.menu": { id: "Menu", en: "Menu" },
  "nav.close": { id: "Tutup", en: "Close" },
  "nav.lang": { id: "Ganti ke English", en: "Switch to Bahasa Indonesia" },
  "nav.skip": { id: "Lewati ke konten", en: "Skip to content" },
  "nav.home": { id: "Velora Studio Dev, ke awal halaman", en: "Velora Studio Dev, back to top" },

  // Hero: one sentence split by the frame
  "hero.left": { id: "Dari sketsa", en: "From sketch" },
  "hero.right": { id: "sampai server", en: "to server" },
  "hero.support": {
    id: "Velora Studio Dev merancang dan membangun website, dashboard, dan aplikasi untuk bisnis. Satu orang mengerjakan semuanya, dari desain sampai kode.",
    en: "Velora Studio Dev designs and builds websites, dashboards and apps for businesses. One person does all of it, from design to code.",
  },
  "hero.reel.sketch": { id: "Wireframe halaman utama DINASTI Barbershop", en: "Wireframe of the DINASTI Barbershop home page" },
  "hero.reel.solid": { id: "Halaman utama DINASTI Barbershop yang sudah live", en: "The DINASTI Barbershop home page, live" },
  "hero.reel.dashboard": { id: "Login dashboard admin, khusus pemilik", en: "Admin dashboard sign-in, owner only" },
  "hero.reel.trail": { id: "Halaman utama Dzikri Mountain Guide yang sudah live", en: "The Dzikri Mountain Guide home page, live" },
  "how.shot.calculator": { id: "Kalkulator biaya trip di situs Dzikri Mountain Guide", en: "Trip cost calculator on the Dzikri Mountain Guide site" },

  // Studio: what Velora is
  "studio.heading": { id: "Apa itu Velora", en: "What Velora is" },
  "studio.statement": {
    id: "Velora Studio Dev adalah studio desain dan software dari Jakarta. Satu orang memegang seluruh prosesnya: memahami bisnis Anda, merancang tampilannya, menulis kodenya, lalu menjaganya tetap menyala. Tidak ada serah-terima antar tim, jadi tidak ada yang hilang di tengah jalan.",
    en: "Velora Studio Dev is a design and software studio from Jakarta. One person holds the whole process: understanding your business, designing how it looks, writing the code, then keeping it running. No hand-offs between teams, so nothing gets lost on the way.",
  },
  "studio.p1.title": { id: "Satu kepala, satu tanggung jawab", en: "One head, one owner" },
  "studio.p1.body": {
    id: "Yang Anda ajak bicara di WhatsApp adalah yang menggambar layar dan menulis kodenya. Keputusan tidak tersesat di rantai tim.",
    en: "The person you talk to on WhatsApp draws the screens and writes the code. Decisions don’t get lost in a chain of teams.",
  },
  "studio.p2.title": { id: "Dibuat untuk dipakai", en: "Made to be used" },
  "studio.p2.body": {
    id: "Barbershop, pemandu gunung, pemilik usaha. Setiap karya Velora dipakai bisnis sungguhan setiap hari, bukan sekadar konsep.",
    en: "A barbershop, a mountain guide, a business owner. Every Velora build is used by a real business every day, not a concept.",
  },
  "studio.p3.title": { id: "Diukur, bukan dikira", en: "Measured, not guessed" },
  "studio.p3.body": {
    id: "Kecepatan, aksesibilitas, dan SEO dicek dengan Lighthouse sebelum rilis. Situs ini sendiri: 100 di keempatnya.",
    en: "Speed, accessibility and SEO are checked with Lighthouse before release. This site itself scores 100 on all four.",
  },
  "studio.stat.live": { id: "sistem live dipakai klien", en: "live systems in client use" },
  "studio.stat.skills": { id: "disiplin dalam satu orang", en: "disciplines in one person" },
  "studio.stat.years": { id: "tahun menulis kode", en: "years writing code" },
  "studio.stat.lighthouse": { id: "skor Lighthouse situs ini", en: "Lighthouse score of this site" },

  // Founder
  "founder.heading": { id: "Di balik Velora", en: "Behind Velora" },
  "founder.role": { id: "Founder · desainer UI/UX & engineer · Jakarta", en: "Founder · UI/UX designer & engineer · Jakarta" },
  "founder.bio": {
    id: "Afataa mulai menulis kode dua tahun lalu dan sejak awal mengerjakan semuanya sendiri: desain di Figma, antarmuka di Next.js, sampai database dan server. Velora adalah nama untuk cara kerja itu, satu orang yang bisa diajak bicara dari ide pertama sampai rilis.",
    en: "Afataa started writing code two years ago and has done every part alone since: design in Figma, interfaces in Next.js, down to the database and server. Velora is the name for that way of working: one person you can talk to from the first idea to the release.",
  },
  "founder.portfolio": { id: "Portofolio pribadi", en: "Personal portfolio" },
  "founder.photo": { id: "Logo Velora sebagai potret sementara", en: "The Velora mark standing in for a portrait" },
  "founder.credit": { id: "Dirancang dan dibangun oleh", en: "Designed and built by" },

  // Work panels
  "work.intro": {
    id: "Tiga sistem yang sedang dipakai klien hari ini. Bukan mockup: semuanya live dan bisa Anda buka.",
    en: "Three systems clients use today. No mockups: all of them are live and you can open them.",
  },
  "work.heading": { id: "Karya", en: "Work" },
  "work.visit": { id: "Buka situs", en: "Visit site" },
  "work.caption.VEL-001": {
    id: "Galeri di situs DINASTI: foto hasil potongan, langsung dari kursi barber.",
    en: "The gallery on the DINASTI site: finished cuts, straight from the barber’s chair.",
  },
  "work.caption.VEL-002": {
    id: "Halaman masuk dashboard: satu tombol login Google, hanya untuk pemilik.",
    en: "The dashboard sign-in: one Google button, for the owner only.",
  },
  "work.caption.VEL-003": {
    id: "Galeri pendakian di situs Dzikri: sunrise, puncak, dan rombongan di Ciremai.",
    en: "The hiking gallery on the Dzikri site: sunrises, summits and groups on Ciremai.",
  },

  // How I work: one verb per discipline
  "how.heading": { id: "Cara kerja", en: "How I work" },
  "how.verb.UI_UX_DESIGN": { id: "Rancang", en: "Design" },
  "how.verb.WEBSITE_ENGINEERING": { id: "Rekayasa", en: "Engineer" },
  "how.verb.WEB_DEVELOPMENT": { id: "Bangun", en: "Build" },
  "how.verb.SOFTWARE_DEVELOPMENT": { id: "Jalankan", en: "Run" },
  "how.tools": { id: "Alat", en: "Tools" },
  "how.intro": {
    id: "Empat tahap, satu orang. Setiap tahap dikerjakan oleh tangan yang sama, jadi desain dan kode tidak pernah saling menebak.",
    en: "Four stages, one person. The same hands do every stage, so design and code never have to guess at each other.",
  },

  // Plan your project (the configurator)
  "plan.heading": { id: "Rancang proyek Anda", en: "Plan your project" },
  "plan.intro": {
    id: "Pilih jenis sistem, keahlian yang dibutuhkan, dan waktunya. Rancangannya dihitung di sini, lalu terkirim lewat WhatsApp.",
    en: "Pick the kind of system, the skills it needs and the time you have. The plan is worked out right here, then sent on WhatsApp.",
  },
  "plan.type": { id: "Jenis sistem", en: "Kind of system" },
  "plan.pillars": { id: "Yang dibutuhkan", en: "What it needs" },
  "plan.timeline": { id: "Waktu", en: "Time" },
  "plan.nodes": { id: "bagian sistem", en: "system parts" },
  "plan.first": { id: "Rilis pertama", en: "First release" },
  "plan.later": { id: "Rilis berikutnya", en: "Later releases" },
  "plan.releases": { id: "rilis", en: "releases" },
  "plan.oneRelease": { id: "Semua masuk satu rilis.", en: "Everything fits one release." },
  "plan.manyReleases": {
    id: "Terlalu banyak untuk waktunya, jadi dibagi bertahap. Versi inti lebih dulu.",
    en: "Too much for the time, so it ships in stages. The core version comes first.",
  },
  "plan.stack": { id: "Teknologi", en: "Technology" },
  "plan.deliverables": { id: "Yang Anda terima", en: "What you get" },
  "plan.reference": { id: "Contoh nyata", en: "Real example" },
  "plan.lighthouse": { id: "Target Lighthouse", en: "Lighthouse target" },
  "plan.name": { id: "Nama Anda (opsional)", en: "Your name (optional)" },
  "plan.notes": { id: "Ceritakan bisnis Anda (opsional)", en: "Tell me about your business (optional)" },
  "plan.pickOne": { id: "Pilih minimal satu keahlian.", en: "Pick at least one skill." },

  // One word is the button
  "band.word": { id: "Chat", en: "Chat" },
  "band.sentence": {
    id: "Kirim rancangan ini ke WhatsApp. Yang membalas adalah orang yang akan mengerjakannya.",
    en: "Send this plan on WhatsApp. The person who replies is the person who builds it.",
  },
  "band.label": { id: "Kirim rancangan lewat WhatsApp", en: "Send the plan on WhatsApp" },

  // Archetypes and timelines (CTA payload enums)
  "cta.archetype.FULL_ECOSYSTEM_WEB_AND_CMS": { id: "Website + dashboard pengelola", en: "Website + admin dashboard" },
  "cta.archetype.FULL_ECOSYSTEM_WEB_AND_CMS.ref": {
    id: "Seperti DINASTI Barbershop dan dashboard-nya",
    en: "Like DINASTI Barbershop and its dashboard",
  },
  "cta.archetype.HIGH_CRAFT_WEB_EXPERIENCE": { id: "Website brand dengan booking", en: "Brand website with booking" },
  "cta.archetype.HIGH_CRAFT_WEB_EXPERIENCE.ref": { id: "Seperti DINASTI Barbershop", en: "Like DINASTI Barbershop" },
  "cta.archetype.CUSTOM_SAAS_OR_MARKETPLACE": { id: "Marketplace atau aplikasi", en: "Marketplace or web app" },
  "cta.archetype.CUSTOM_SAAS_OR_MARKETPLACE.ref": { id: "Seperti Dzikri Mountain Guide", en: "Like Dzikri Mountain Guide" },
  "cta.archetype.DESIGN_SYSTEM_AND_UIUX_OVERHAUL": { id: "Desain ulang & design system", en: "Redesign & design system" },
  "cta.archetype.DESIGN_SYSTEM_AND_UIUX_OVERHAUL.ref": {
    id: "Untuk produk yang sudah berjalan",
    en: "For a product that already runs",
  },
  "cta.timeline.URGENT_2_4_WEEKS": { id: "2–4 minggu", en: "2–4 weeks" },
  "cta.timeline.STANDARD_1_2_MONTHS": { id: "1–2 bulan", en: "1–2 months" },
  "cta.timeline.ENTERPRISE_3_MONTHS_PLUS": { id: "3 bulan lebih", en: "3 months or more" },
  "cta.archetype": { id: "Jenis sistem", en: "Kind of system" },
  "cta.pillars": { id: "Keahlian", en: "Skills" },
  "cta.timeline": { id: "Waktu", en: "Time" },
  "cta.msg.greeting": { id: "Halo Velora Studio Dev, saya ingin memulai proyek.", en: "Hi Velora Studio Dev, I would like to start a project." },
  "cta.msg.subject": { id: "Brief Proyek", en: "Project Brief" },
  "cta.msg.name": { id: "Nama", en: "Name" },
  "cta.msg.blueprint": { id: "Rancangan", en: "Plan" },
  "cta.msg.nodes": { id: "bagian sistem", en: "system parts" },

  // Footer
  "footer.invite1": { id: "Punya proyek?", en: "Got a project?" },
  "footer.invite2": { id: "Ceritakan saja.", en: "Tell me about it." },
  "footer.dev": {
    id: "Untuk developer: tekan ~ untuk terminal, Ctrl+K untuk menu, dan Alt+I untuk membedah halaman ini.",
    en: "For developers: press ~ for the terminal, Ctrl+K for the menu and Alt+I to inspect this page.",
  },
  "footer.top": { id: "Kembali ke atas", en: "Back to top" },

  // Redline inspector
  "inspector.hud": {
    id: "Inspector aktif. Arahkan kursor ke bagian mana pun. Alt+I untuk keluar.",
    en: "Inspector on. Point at any part of the page. Alt+I to exit.",
  },
  "inspector.padding": { id: "padding", en: "padding" },

  // CLI
  "terminal.title": { id: "Velora CLI", en: "Velora CLI" },
  "terminal.engine": { id: "Studio desain & software satu orang", en: "One-person design & software studio" },
  "terminal.welcome": { id: "Ketik `help` untuk daftar perintah.", en: "Type `help` for the command list." },
  "terminal.notFound": { id: "perintah tidak dikenal:", en: "command not found:" },
  "terminal.usage": { id: "penggunaan:", en: "usage:" },
  "terminal.help.help": { id: "tampilkan daftar perintah", en: "show the command list" },
  "terminal.help.pillars": { id: "empat keahlian", en: "the four skills" },
  "terminal.help.ls": { id: "daftar karya", en: "list the work" },
  "terminal.help.inspect": { id: "detail arsitektur & metrik karya", en: "a project’s architecture & metrics" },
  "terminal.help.lang": { id: "ganti bahasa", en: "switch language" },
  "terminal.help.inspector": { id: "nyalakan/matikan inspector", en: "toggle the inspector" },
  "terminal.help.cta": { id: "lompat ke perancang proyek", en: "jump to the project planner" },
  "terminal.help.clear": { id: "bersihkan layar", en: "clear the screen" },
  "terminal.help.exit": { id: "tutup terminal", en: "close the terminal" },
  "terminal.input": { id: "Perintah terminal", en: "Terminal command" },
  "terminal.close": { id: "Tutup terminal", en: "Close terminal" },
  "terminal.langSet": { id: "bahasa:", en: "language:" },
  "terminal.inspectorSet": { id: "inspector:", en: "inspector:" },
  "terminal.jump": { id: "melompat ke", en: "jumping to" },
  "terminal.unknownProject": { id: "karya tidak ditemukan:", en: "project not found:" },
  "terminal.hint": { id: "~ untuk buka/tutup, ↑↓ riwayat", en: "~ to toggle, ↑↓ history" },

  // Command menu
  "cmdk.title": { id: "Menu perintah", en: "Command menu" },
  "cmdk.placeholder": { id: "Ketik perintah atau cari…", en: "Type a command or search…" },
  "cmdk.empty": { id: "Tidak ada hasil.", en: "No results." },
  "cmdk.group.navigate": { id: "Navigasi", en: "Navigate" },
  "cmdk.group.language": { id: "Bahasa", en: "Language" },
  "cmdk.group.actions": { id: "Aksi", en: "Actions" },
  "cmdk.action.inspector": { id: "Nyalakan atau matikan inspector", en: "Toggle the inspector" },
  "cmdk.action.terminal": { id: "Buka Velora CLI", en: "Open Velora CLI" },
  "cmdk.action.whatsapp": { id: "Chat di WhatsApp", en: "Chat on WhatsApp" },
  "cmdk.action.email": { id: "Salin alamat email", en: "Copy email address" },
  "cmdk.action.live": { id: "Buka situs", en: "Visit site" },
  "cmdk.copied": { id: "Email disalin", en: "Email copied" },
} satisfies Record<string, LocalizedText>;

export type DictionaryKey = keyof typeof seed;
export const dictionary: Readonly<Record<DictionaryKey, LocalizedText>> = seed;

export function translate(locale: Locale, key: DictionaryKey): string {
  return dictionary[key][locale];
}
