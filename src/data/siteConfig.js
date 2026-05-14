// Edit these values to customize the site for your business.
export const siteConfig = {
  brand: {
    name: 'Tech Productions',
  },
  // Without leading "+" or spaces. Example: 6281234567890
  whatsappNumber: '6281234567890',
  whatsappMessage:
    'Hallo Tech Productions, saya tertarik untuk berdiskusi tentang sebuah proyek.',
  email: 'contact@tptech.id',
  // Used by both the Contact card and the embedded map iframe.
  address: {
    line1: 'Jakarta Digital District',
    line2: 'Jalan Sudirman Kav. 25, Jakarta Selatan, DKI Jakarta 12930',
    mapsQuery: 'Sudirman+Jakarta+Selatan',
  },
  social: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    github: 'https://github.com/',
    youtube: 'https://youtube.com/',
  },
  // Simple password gate for /admin (frontend-only — replace with real auth
  // when integrating a backend). Change this to your own password.
  adminPassword: 'admin123',
};

export const navLinks = [
  { id: 'home', label: 'Beranda' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'projects', label: 'Project' },
  { id: 'about', label: 'About' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
];

// Seed data for Team Members
export const teamMembers = [
  {
    id: 'member-1',
    name: 'Nama Anggota Pertama',
    role: 'Co-Founder & Lead Developer',
    education: 'S1 Teknik Informatika, Universitas Contoh',
    experience: '5+ tahun pengalaman dalam pengembangan Full-Stack Web dan AI System. Mengkhususkan diri pada arsitektur scalable dan performa tinggi.',
    image: 'https://ui-avatars.com/api/?name=Anggota+Pertama&background=0D8ABC&color=fff&size=256'
  },
  {
    id: 'member-2',
    name: 'Nama Anggota Kedua',
    role: 'Co-Founder & UI/UX Designer',
    education: 'S1 Sistem Informasi, Universitas Contoh',
    experience: '4+ tahun pengalaman dalam mendesain antarmuka pengguna (UI/UX) untuk berbagai produk digital yang intuitif dan berpusat pada pengguna.',
    image: 'https://ui-avatars.com/api/?name=Anggota+Kedua&background=E11D48&color=fff&size=256'
  }
];

// Seed data — used the first time the app loads when localStorage is empty.
export const seedCatalog = [
  {
    id: 'svc-1',
    title: 'Jasa Tugas Program IT',
    description:
      'Bantuan tugas pemrograman, algoritma, struktur data, dan proyek akhir untuk mahasiswa dan profesional.',
    icon: 'GraduationCap',
    color: 'sky',
  },
  {
    id: 'svc-2',
    title: 'Jasa Rakit PC & Instalasi',
    description:
      'Rakit PC custom sesuai kebutuhan — gaming, workstation, dan server, lengkap dengan instalasi OS & software.',
    icon: 'Cpu',
    color: 'violet',
  },
  {
    id: 'svc-3',
    title: 'Buat Website',
    description:
      'Website company profile, e-commerce, hingga aplikasi web custom dengan stack modern dan responsif.',
    icon: 'Globe',
    color: 'emerald',
  },
  {
    id: 'svc-4',
    title: 'Instalasi Jaringan Mikrotik',
    description:
      'Konfigurasi router, hotspot, VPN, dan manajemen bandwidth dengan perangkat Mikrotik untuk rumah & kantor.',
    icon: 'Network',
    color: 'amber',
  },
  {
    id: 'svc-5',
    title: 'Undangan Digital',
    description:
      'Undangan pernikahan, ulang tahun, dan acara digital interaktif yang elegan, mobile-friendly, dan mudah dibagikan.',
    icon: 'Mail',
    color: 'rose',
  },
  {
    id: 'svc-6',
    title: 'POS (Sistem Kasir)',
    description:
      'Sistem kasir berbasis web/desktop untuk UMKM, restoran, dan retail. Lengkap dengan laporan & manajemen stok.',
    icon: 'Receipt',
    color: 'indigo',
  },
  {
    id: 'svc-7',
    title: 'Aplikasi Android / iOS',
    description:
      'Pembuatan aplikasi mobile native maupun cross-platform untuk berbagai kebutuhan bisnis dan komunitas.',
    icon: 'Smartphone',
    color: 'cyan',
  },
  {
    id: 'svc-8',
    title: 'Instalasi IoT',
    description:
      'Solusi smart home, monitoring sensor, dan integrasi perangkat IoT dengan dashboard real-time.',
    icon: 'Cog',
    color: 'slate',
    badge: 'Coming Soon',
  },
];

export const seedProjects = [
  {
    id: 'prj-1',
    title: 'WebGIS Pemetaan Wilayah',
    description:
      'Sistem informasi geografis berbasis web untuk pemetaan area kerja dan analisis spasial real-time.',
    images: [],
    tag: 'WebGIS',
    color: 'emerald',
  },
  {
    id: 'prj-2',
    title: 'AI Customer Support Bot',
    description:
      'Chatbot berbasis LLM untuk customer service 24/7, terintegrasi dengan WhatsApp dan dashboard CRM.',
    images: [],
    tag: 'AI System',
    color: 'violet',
  },
  {
    id: 'prj-3',
    title: 'E-Commerce Platform UMKM',
    description:
      'Platform e-commerce multi-tenant dengan payment gateway, manajemen pengiriman, dan dashboard analytics.',
    images: [],
    tag: 'Web App',
    color: 'sky',
  },
  {
    id: 'prj-4',
    title: 'Animasi Eksplainer 2D',
    description:
      'Video animasi karakter 2D untuk keperluan marketing, edukasi, dan storytelling produk digital.',
    images: [],
    tag: 'Motion',
    color: 'rose',
  },
];

/**
 * Backward-compatible accessor — handles both old single-`image` and new
 * `images[]` schemas. Returns array of image URLs/data URIs.
 */
export function getProjectImages(p) {
  if (Array.isArray(p?.images) && p.images.length > 0) return p.images;
  if (typeof p?.image === 'string' && p.image) return [p.image];
  return [];
}

// Seed tasks for the Admin → Tasks page (work tracking for ongoing projects).
const today = new Date();
const inDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seedTasks = [
  {
    id: 'tsk-1',
    projectName: 'Website CV Andalan Jaya',
    deadline: inDays(7),
    clientNote:
      'Klien minta revisi warna jadi lebih earthy. Slot meeting konfirmasi via WA Senin pagi.',
    location: 'online',
    status: 'in_progress',
    createdAt: today.toISOString(),
  },
  {
    id: 'tsk-2',
    projectName: 'POS Restoran Sambal Khas',
    deadline: inDays(14),
    clientNote:
      'Butuh integrasi printer thermal Xprinter XP-58, training 2 sesi onsite di outlet utama.',
    location: 'onsite',
    status: 'todo',
    createdAt: today.toISOString(),
  },
  {
    id: 'tsk-3',
    projectName: 'Undangan Digital Pernikahan Aldi & Sari',
    deadline: inDays(3),
    clientNote:
      'Tema floral pastel, RSVP form + galeri foto pre-wedding. Final preview Kamis sore.',
    location: 'online',
    status: 'in_progress',
    createdAt: today.toISOString(),
  },
];
