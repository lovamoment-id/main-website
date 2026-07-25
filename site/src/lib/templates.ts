/** Occasion tags. Closed vocabulary (design brief §4). Do not add new values. */
export type Tag =
  | "ANNIVERSARY"
  | "BIRTHDAY"
  | "CRUSH"
  | "LDR"
  | "ANY OCCASION"
  | "GAME";

export type Tier = "CLASSIC" | "PREMIUM" | "EXCLUSIVE";

/**
 * Status badge. Closed vocabulary (design brief §4). At most one per card, and
 * it pairs with at most one tier badge, so a card never shows more than two.
 */
export type StatusBadge = "#1 TERLARIS" | "POPULAR" | "NEW";

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  tier: Tier;
  tags: Tag[];
  price: number;
  originalPrice: number;
  demoUrl: string;
  photoCount: number;
  /**
   * Marketing screenshots (sample1.jpg ...) in /public/templates/[slug], per
   * design brief §10. Independent of photoCount, which counts buyer photo slots.
   */
  sampleCount: number;
  supportsMusic: boolean;
  soldCount: number;
  statusBadge: StatusBadge | null;
  description: string;
};

/** Real catalogue data, seeded from design brief §9. Ordered by tier, then price. */
export const templates: Template[] = [
  {
    slug: "3d-ily",
    name: "3D I Love You",
    tagline: "Hati 3D yang berputar membawa pesan 'I Love You'",
    tier: "CLASSIC",
    tags: ["CRUSH", "LDR", "ANY OCCASION"],
    price: 20000,
    originalPrice: 100000,
    demoUrl: "https://3d-ily-lovamoment.vercel.app/",
    photoCount: 0,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 9,
    statusBadge: "NEW",
    description:
      "Animasi 3D hati yang berputar dengan pesan cinta, diiringi musik latar. Ucapan singkat yang elegan tanpa perlu foto.",
  },
  {
    slug: "3d-hearts-blue",
    name: "3D Hearts",
    tagline: "Hati-hati metalik yang melayang lembut dalam ruang 3D",
    tier: "CLASSIC",
    tags: ["CRUSH", "LDR", "ANY OCCASION"],
    price: 20000,
    originalPrice: 100000,
    demoUrl: "https://3d-hearts-blue-lovamoment.vercel.app/",
    photoCount: 0,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 12,
    statusBadge: "NEW",
    description:
      "Animasi 3D hati metalik yang melayang lembut, diiringi musik latar. Ucapan singkat yang elegan tanpa perlu foto.",
  },
  {
    slug: "kotak-musik",
    name: "Kotak Musik",
    tagline: "Buka kotak musik, dengarkan lagu dan lihat kenangan",
    tier: "CLASSIC",
    tags: ["ANNIVERSARY", "BIRTHDAY", "ANY OCCASION"],
    price: 30000,
    originalPrice: 125000,
    demoUrl: "https://kotak-musik-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 34,
    statusBadge: null,
    description:
      "Template kotak musik digital yang terbuka dengan animasi lembut, menampilkan foto kenangan diiringi musik latar.",
  },
  {
    slug: "lepas-lampion",
    name: "Lepas Lampion",
    tagline: "Lepaskan lampion berisi harapan dan doa untuk orang tersayang",
    tier: "CLASSIC",
    tags: ["ANNIVERSARY", "LDR", "ANY OCCASION"],
    price: 30000,
    originalPrice: 125000,
    demoUrl: "https://lepas-lampion-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 33,
    statusBadge: null,
    description:
      "Template interaktif melepas lampion ke langit malam, menampilkan foto kenangan dan pesan harapan.",
  },
  {
    slug: "our-night-sky",
    name: "Our Night Sky",
    tagline: "Langit malam penuh bintang berisi kenangan kalian berdua",
    tier: "CLASSIC",
    tags: ["ANNIVERSARY", "LDR", "CRUSH"],
    price: 30000,
    originalPrice: 125000,
    demoUrl: "https://our-night-sky-lovamoment.vercel.app/",
    photoCount: 5,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 28,
    statusBadge: null,
    description:
      "Template langit malam interaktif. Setiap bintang menyimpan satu foto kenangan yang bisa disentuh satu per satu.",
  },
  {
    slug: "pesan-dalam-botol",
    name: "Pesan Dalam Botol",
    tagline: "Buka botol yang terdampar, temukan pesan di dalamnya",
    tier: "CLASSIC",
    tags: ["ANNIVERSARY", "LDR", "ANY OCCASION"],
    price: 30000,
    originalPrice: 125000,
    demoUrl: "https://pesan-dalam-botol-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 18,
    statusBadge: "NEW",
    description:
      "Template interaktif botol pesan yang terombang-ambing di laut. Buka untuk menemukan foto dan surat di dalamnya.",
  },
  {
    slug: "scratch-card",
    name: "Kartu Gosok Cinta",
    tagline: "Gosok satu per satu, temukan kenangan di baliknya",
    tier: "CLASSIC",
    tags: ["BIRTHDAY", "CRUSH", "GAME"],
    price: 30000,
    originalPrice: 130000,
    demoUrl: "https://scratch-card-lovamoment.vercel.app/",
    photoCount: 6,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 15,
    statusBadge: "NEW",
    description:
      "Kartu gosok interaktif. Setiap kartu menyimpan satu foto dan satu kenangan yang baru terlihat setelah digosok.",
  },
  {
    slug: "letter-botanical",
    name: "Letter Botanical",
    tagline: "Surat cinta dengan nuansa daun dan bunga yang lembut",
    tier: "PREMIUM",
    tags: ["ANNIVERSARY", "ANY OCCASION"],
    price: 40000,
    originalPrice: 160000,
    demoUrl: "https://letter-botanical-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 26,
    statusBadge: null,
    description:
      "Template surat digital bergaya botanical, cocok untuk mengungkapkan perasaan lewat kata-kata, lengkap dengan foto kenangan dan musik latar.",
  },
  {
    slug: "letter-coastal",
    name: "Letter Coastal",
    tagline: "Nuansa pantai yang tenang untuk surat cintamu",
    tier: "PREMIUM",
    tags: ["ANNIVERSARY", "LDR", "ANY OCCASION"],
    price: 40000,
    originalPrice: 160000,
    demoUrl: "https://letter-coastal-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 24,
    statusBadge: null,
    description:
      "Template surat digital dengan palet warna coastal yang menenangkan, lengkap dengan foto kenangan dan musik latar.",
  },
  {
    slug: "letter-goldenhour",
    name: "Letter Golden Hour",
    tagline: "Hangatnya golden hour dalam sebuah surat",
    tier: "PREMIUM",
    tags: ["ANNIVERSARY", "CRUSH", "ANY OCCASION"],
    price: 40000,
    originalPrice: 160000,
    demoUrl: "https://letter-goldenhour-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 38,
    statusBadge: null,
    description:
      "Template surat digital dengan nuansa golden hour yang hangat, lengkap dengan foto kenangan dan musik latar.",
  },
  {
    slug: "letter-starlit",
    name: "Letter Starlit",
    tagline: "Surat cinta di bawah taburan bintang",
    tier: "PREMIUM",
    tags: ["ANNIVERSARY", "LDR", "ANY OCCASION"],
    price: 40000,
    originalPrice: 160000,
    demoUrl: "https://letter-starlit-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 21,
    statusBadge: null,
    description:
      "Template surat digital bertema langit malam berbintang, lengkap dengan foto kenangan dan musik latar.",
  },
  {
    slug: "letter-vintage",
    name: "Letter Vintage",
    tagline: "Sentuhan klasik untuk surat yang tak lekang waktu",
    tier: "PREMIUM",
    tags: ["ANNIVERSARY", "ANY OCCASION"],
    price: 40000,
    originalPrice: 160000,
    demoUrl: "https://letter-vintage-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 29,
    statusBadge: null,
    description:
      "Template surat digital bergaya vintage yang klasik, lengkap dengan foto kenangan dan musik latar.",
  },
  {
    slug: "claw-machine",
    name: "Claw Machine",
    tagline: "Mainkan mesin capit untuk memenangkan kenanganmu",
    tier: "PREMIUM",
    tags: ["BIRTHDAY", "CRUSH", "GAME"],
    price: 45000,
    originalPrice: 150000,
    demoUrl: "https://claw-machine-lovamoment.vercel.app/",
    photoCount: 1,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 47,
    statusBadge: "POPULAR",
    description:
      "Mini-game mesin capit (claw machine) interaktif. Mainkan untuk membuka foto dan pesan spesial.",
  },
  {
    slug: "gacha-love",
    name: "Gacha Love",
    tagline: "Tarik gacha, dapatkan kenangan random tiap kali dicoba",
    tier: "PREMIUM",
    tags: ["BIRTHDAY", "CRUSH", "GAME"],
    price: 45000,
    originalPrice: 150000,
    demoUrl: "https://gacha-love-lovamoment.vercel.app/",
    photoCount: 3,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 45,
    statusBadge: "POPULAR",
    description:
      "Template gacha interaktif bergaya mesin capsule toy. Tarik untuk mendapatkan foto dan pesan kenangan secara acak.",
  },
  {
    slug: "premium-birthday-blush",
    name: "Birthday Blush",
    tagline: "Ucapan ulang tahun mewah dengan nuansa blush pink",
    tier: "EXCLUSIVE",
    tags: ["BIRTHDAY"],
    price: 50000,
    originalPrice: 200000,
    demoUrl: "https://premium-birthday-blush-lovamoment.vercel.app/",
    photoCount: 6,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 63,
    statusBadge: "#1 TERLARIS",
    description:
      "Template ucapan ulang tahun premium dengan 6 foto dan musik latar, lengkap dengan hitung mundur, galeri kenangan, dan ucapan personal.",
  },
  {
    slug: "premium-birthday-nostalgic",
    name: "Birthday Nostalgic",
    tagline: "Ucapan ulang tahun mewah dengan nuansa nostalgic",
    tier: "EXCLUSIVE",
    tags: ["BIRTHDAY"],
    price: 50000,
    originalPrice: 200000,
    demoUrl: "https://premium-birthday-nostalgic-lovamoment.vercel.app/",
    photoCount: 6,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 20,
    statusBadge: null,
    description:
      "Template ucapan ulang tahun premium dengan 6 foto dan musik latar, lengkap dengan hitung mundur, galeri kenangan, dan ucapan personal.",
  },
  {
    slug: "premium-birthday-midnight",
    name: "Birthday Midnight",
    tagline: "Ucapan ulang tahun mewah dengan nuansa midnight gold",
    tier: "EXCLUSIVE",
    tags: ["BIRTHDAY"],
    price: 50000,
    originalPrice: 200000,
    demoUrl: "https://premium-birthday-midnight-lovamoment.vercel.app/",
    photoCount: 6,
    sampleCount: 2,
    supportsMusic: true,
    soldCount: 51,
    statusBadge: "POPULAR",
    description:
      "Template ucapan ulang tahun premium dengan 6 foto dan musik latar, lengkap dengan hitung mundur, galeri kenangan, dan ucapan personal.",
  },
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getSampleImages(template: Template): string[] {
  return Array.from(
    { length: template.sampleCount },
    (_, i) => `/templates/${template.slug}/sample${i + 1}.jpg`,
  );
}

/** Filter chip order on the gallery. */
export const tags: Tag[] = [
  "ANNIVERSARY",
  "BIRTHDAY",
  "CRUSH",
  "LDR",
  "ANY OCCASION",
  "GAME",
];

export const tagLabels: Record<Tag, string> = {
  ANNIVERSARY: "Anniversary",
  BIRTHDAY: "Birthday",
  CRUSH: "Crush",
  LDR: "LDR",
  "ANY OCCASION": "Any Occasion",
  GAME: "Game",
};

export const tierLabels: Record<Tier, string> = {
  CLASSIC: "Classic",
  PREMIUM: "Premium",
  EXCLUSIVE: "Exclusive",
};

/** CLASSIC intentionally has no tier badge (design brief §4). */
export const tierBadgeLabels: Partial<Record<Tier, string>> = {
  PREMIUM: "PREMIUM",
  EXCLUSIVE: "EXCLUSIVE",
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
