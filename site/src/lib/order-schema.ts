/**
 * What each template asks the buyer for.
 *
 * One source of truth: the public form renders from this, the server
 * validates against it, and /v/[orderSlug] maps the answers back onto each
 * template's CONFIG. Adding a question means editing only this file.
 *
 * `configKey` is the property the answer overwrites in the template's own
 * CONFIG. Fields without one are either handled specially (the letter body,
 * which replaces #letter-source) or are admin-facing only.
 */

export type FieldKind = "text" | "textarea" | "date" | "select" | "letter";

export type Field = {
  /** Key inside order payload. */
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  /** Overwrites this CONFIG property when set. */
  configKey?: string;
  help?: string;
  placeholder?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
};

/** A block of fields repeated N times, one per star / card / photo. */
export type RepeatingGroup = {
  /** Key in payload; answers stored as an array of objects. */
  name: string;
  label: string;
  /** Exact number of entries. */
  count: number;
  /** True when each entry also expects one uploaded photo. */
  withPhoto: boolean;
  fields: Field[];
  /** CONFIG property that receives the assembled array. */
  configKey?: string;
  help?: string;
};

export type PhotoRule = {
  min: number;
  max: number;
  /** Shown under the upload control. */
  help: string;
};

export type TemplateSchema = {
  /** Payload key holding the recipient name, used for the browser tab title. */
  recipientField: string;
  fields: Field[];
  groups?: RepeatingGroup[];
  photos?: PhotoRule;
  /** Music upload is offered on every template; this is only the wording. */
  musicHelp?: string;
};

const RECIPIENT: Field = {
  name: "recipientName",
  label: "Nama penerima",
  kind: "text",
  required: true,
  configKey: "recipientName",
  maxLength: 40,
  help: "Nama yang muncul di dalam template.",
};

const SENDER: Field = {
  name: "senderName",
  label: "Nama pengirim",
  kind: "text",
  required: true,
  configKey: "senderName",
  maxLength: 40,
  help: "Nama di bagian tanda tangan.",
};

/** Buyers are told to press Enter, not to aim for a paragraph count. */
const LETTER: Field = {
  name: "letter",
  label: "Isi surat",
  kind: "letter",
  required: true,
  maxLength: 3000,
  help: "Tekan Enter untuk memulai paragraf baru.",
};

const OCCASION: Field = {
  name: "occasion",
  label: "Untuk momen apa",
  kind: "text",
  required: false,
  configKey: "occasion",
  maxLength: 30,
  placeholder: "Untukmu",
  help: "Muncul sebagai label kecil di atas nama. Kosongkan untuk memakai default.",
};

const MUSIC_DEFAULT = "Kosongkan kalau mau memakai lagu bawaan template.";

/** The two 3D scenes: no photos, no letter. */
const scene3d = (): TemplateSchema => ({
  recipientField: "recipientName",
  fields: [
    { ...RECIPIENT, configKey: undefined, help: "Dipakai di judul halaman dan sapaan pembuka." },
    {
      name: "centerText",
      label: "Ucapan di tengah",
      kind: "text",
      required: false,
      configKey: "CENTER_TEXT",
      maxLength: 28,
      placeholder: "Love you",
      help: "Maksimal 4 kata supaya tetap terbaca di dalam animasi 3D.",
    },
  ],
  musicHelp: MUSIC_DEFAULT,
});

/** The five letter templates share one shape. */
const letterTemplate = (): TemplateSchema => ({
  recipientField: "recipientName",
  fields: [RECIPIENT, SENDER, LETTER],
  photos: { min: 3, max: 3, help: "Wajib 3 foto." },
  musicHelp: MUSIC_DEFAULT,
});

/** The three premium birthday templates share one shape. */
const birthdayPremium = (): TemplateSchema => ({
  recipientField: "recipientName",
  fields: [
    RECIPIENT,
    SENDER,
    {
      name: "birthDate",
      label: "Tanggal lahir penerima",
      kind: "date",
      required: true,
      configKey: "birthDate",
      help: "Umur dan hitung mundur dihitung otomatis dari tanggal ini.",
    },
    LETTER,
    {
      name: "lovePoints",
      label: "Hal yang kamu suka darinya",
      kind: "textarea",
      required: false,
      configKey: "lovePoints",
      maxLength: 1200,
      help: "Satu hal per baris, maksimal 6. Kosongkan untuk memakai daftar bawaan.",
    },
    {
      name: "prayers",
      label: "Doa dan harapan",
      kind: "textarea",
      required: false,
      configKey: "prayers",
      maxLength: 1200,
      help: "Satu doa per baris. Kosongkan untuk memakai daftar bawaan.",
    },
    {
      name: "songTitle",
      label: "Judul lagu",
      kind: "text",
      required: false,
      configKey: "songTitle",
      maxLength: 60,
      help: "Teks yang tampil di pemutar musik. Kosongkan untuk memakai default.",
    },
    {
      name: "songArtist",
      label: "Penyanyi",
      kind: "text",
      required: false,
      configKey: "songArtist",
      maxLength: 60,
      help: "Kosongkan untuk memakai default.",
    },
  ],
  photos: { min: 1, max: 6, help: "Boleh 1 sampai 6 foto." },
  musicHelp: MUSIC_DEFAULT,
});

export const templateSchemas: Record<string, TemplateSchema> = {
  "3d-ily": scene3d(),
  "3d-hearts-blue": scene3d(),

  "letter-botanical": letterTemplate(),
  "letter-coastal": letterTemplate(),
  "letter-goldenhour": letterTemplate(),
  "letter-starlit": letterTemplate(),
  // sealInitial is derived from the recipient name, so it is not asked here.
  "letter-vintage": letterTemplate(),

  "premium-birthday-blush": birthdayPremium(),
  "premium-birthday-midnight": birthdayPremium(),
  "premium-birthday-nostalgic": birthdayPremium(),

  "claw-machine": {
    recipientField: "recipientName",
    fields: [
      RECIPIENT,
      SENDER,
      { ...LETTER, configKey: "letterParagraphs" },
      {
        name: "letterTitle",
        label: "Judul surat",
        kind: "text",
        required: false,
        configKey: "letterTitle",
        maxLength: 60,
        placeholder: "Hadiah Utama Hidupku",
      },
      {
        name: "photoCaption",
        label: "Caption foto",
        kind: "text",
        required: false,
        configKey: "photoCaption",
        maxLength: 40,
      },
    ],
    photos: { min: 1, max: 1, help: "Satu foto hadiah." },
    musicHelp: MUSIC_DEFAULT,
  },

  "gacha-love": {
    recipientField: "recipientName",
    fields: [
      { ...RECIPIENT, configKey: undefined, help: "Dipakai di judul halaman dan papan nama." },
      { ...SENDER, configKey: undefined, help: "Papan nama disusun otomatis jadi pengirim & penerima." },
      { ...LETTER, configKey: "letterBody" },
      {
        name: "letterTitle",
        label: "Judul surat",
        kind: "text",
        required: false,
        configKey: "letterTitle",
        maxLength: 80,
      },
      {
        name: "musicTitle",
        label: "Judul lagu",
        kind: "text",
        required: false,
        configKey: "musicTitle",
        maxLength: 60,
        help: "Kosongkan untuk memakai default.",
      },
    ],
    groups: [
      {
        name: "photoItems",
        label: "Foto hadiah",
        count: 3,
        withPhoto: true,
        configKey: "photoCaptions",
        help: "Tiap foto dipasangkan dengan captionnya sendiri.",
        fields: [
          { name: "caption", label: "Caption", kind: "text", required: false, maxLength: 40 },
        ],
      },
    ],
    musicHelp: MUSIC_DEFAULT,
  },

  "our-night-sky": {
    recipientField: "forName",
    fields: [
      { ...RECIPIENT, name: "forName", configKey: "forName" },
      { ...SENDER, name: "fromName", configKey: "fromName" },
    ],
    groups: [
      {
        name: "memories",
        label: "Bintang kenangan",
        count: 5,
        withPhoto: true,
        configKey: "memories",
        help: "Lima bintang, masing-masing satu kenangan dan satu foto.",
        fields: [
          { name: "label", label: "Judul momen", kind: "text", required: true, maxLength: 30, placeholder: "Our Date" },
          { name: "date", label: "Kapan", kind: "text", required: true, maxLength: 20, placeholder: "Juni 2025" },
          { name: "note", label: "Catatan", kind: "textarea", required: true, maxLength: 200 },
        ],
      },
    ],
    musicHelp: MUSIC_DEFAULT,
  },

  "scratch-card": {
    recipientField: "recipientName",
    fields: [RECIPIENT, SENDER, LETTER],
    groups: [
      {
        name: "cards",
        label: "Kartu gosok",
        count: 6,
        withPhoto: true,
        configKey: "cards",
        help: "Enam kartu, masing-masing satu pesan dan satu foto.",
        fields: [
          { name: "title", label: "Judul kartu", kind: "text", required: true, maxLength: 30 },
          { name: "message", label: "Pesan", kind: "textarea", required: true, maxLength: 250 },
        ],
      },
    ],
    musicHelp: MUSIC_DEFAULT,
  },

  "kotak-musik": {
    recipientField: "recipientName",
    fields: [RECIPIENT, SENDER, OCCASION, LETTER],
    photos: { min: 0, max: 3, help: "Sampai 3 foto, semuanya opsional." },
    musicHelp: MUSIC_DEFAULT,
  },

  "lepas-lampion": {
    recipientField: "recipientName",
    fields: [
      RECIPIENT,
      SENDER,
      OCCASION,
      {
        name: "wishes",
        label: "Harapan dan doa",
        kind: "textarea",
        required: true,
        configKey: "wishes",
        maxLength: 1200,
        help: "Satu harapan per baris. Jumlah baris menentukan jumlah lampion.",
      },
      LETTER,
    ],
    // Capped at 3 to match photoCount in the catalogue, which is what the
    // product page promises. Lanterns beyond the third simply fly without a
    // photo, which the template already handles.
    photos: { min: 0, max: 3, help: "Sampai 3 foto lampion, semuanya opsional." },
    musicHelp: MUSIC_DEFAULT,
  },

  "pesan-dalam-botol": {
    recipientField: "forName",
    fields: [
      { ...RECIPIENT, name: "forName", configKey: "forName" },
      { ...SENDER, name: "fromName", configKey: "fromName" },
      {
        name: "sceneMode",
        label: "Suasana",
        kind: "select",
        required: true,
        configKey: "sceneMode",
        options: [
          { value: "sunset", label: "Senja" },
          { value: "night", label: "Malam" },
        ],
      },
      LETTER,
      {
        name: "memTitle",
        label: "Judul bagian kenangan",
        kind: "text",
        required: false,
        configKey: "memTitle",
        maxLength: 40,
        placeholder: "Kenangan Kita",
      },
      {
        name: "photoCaption",
        label: "Caption foto utama",
        kind: "text",
        required: false,
        configKey: "photoCaption",
        maxLength: 40,
      },
    ],
    photos: { min: 1, max: 3, help: "Foto pertama wajib, dua sisanya opsional." },
    musicHelp: MUSIC_DEFAULT,
  },
};

export function getSchema(templateSlug: string): TemplateSchema | undefined {
  return templateSchemas[templateSlug];
}
