"use server";

import { createOrder } from "@/lib/orders";
import { getSchema } from "@/lib/order-schema";
import { getTemplateBySlug } from "@/lib/templates";
import { createUploadTickets, newAssetFolder, type UploadTicket } from "@/lib/storage";

/**
 * The action returns upload tickets instead of redirecting.
 *
 * Files cannot be posted here: production rejects request bodies over roughly
 * 4.5 MB with a 413 before this code runs, and one phone photo can exceed that.
 * So the order row is created from text only, and the browser then uploads each
 * file straight to Supabase using these one time URLs.
 */
export type OrderFormState = {
  error: string | null;
  ok?: boolean;
  orderSlug?: string;
  tickets?: UploadTicket[];
};

/** Indonesian mobile numbers, normalised to the 628... form wa.me expects. */
function normaliseWhatsapp(raw: string): string | null {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 9 || digits.length > 15) return null;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

/** Keep only an extension we can actually process later. */
const ALLOWED_IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);
const ALLOWED_AUDIO_EXT = new Set(["mp3", "m4a", "aac", "mp4", "ogg", "wav"]);

function safeExtension(fileName: string, allowed: Set<string>): string | null {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return null;
  const ext = fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
  return allowed.has(ext) ? ext : null;
}

export async function submitOrder(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const templateSlug = String(formData.get("templateSlug") ?? "");

  // Price comes from the server side catalogue, never from the form, so a
  // tampered field cannot buy an Exclusive template at Classic price.
  const template = getTemplateBySlug(templateSlug);
  const schema = getSchema(templateSlug);
  if (!template || !schema) {
    return { error: "Template tidak ditemukan." };
  }

  const customerName = String(formData.get("customerName") ?? "").trim();
  const whatsappRaw = String(formData.get("customerWhatsapp") ?? "").trim();
  const customSlug = String(formData.get("customSlug") ?? "").trim();

  if (!customerName || !whatsappRaw) {
    return { error: "Nama dan nomor WhatsApp kamu wajib diisi." };
  }

  const customerWhatsapp = normaliseWhatsapp(whatsappRaw);
  if (!customerWhatsapp) {
    return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890." };
  }

  // Only questions this template actually asks are stored. Anything else in the
  // POST is ignored, so a crafted request cannot smuggle extra keys that would
  // later be written into the template's CONFIG.
  const payload: Record<string, unknown> = {};

  for (const field of schema.fields) {
    const value = String(formData.get(field.name) ?? "").trim();
    if (field.required && !value) return { error: field.label + " wajib diisi." };
    if (field.maxLength && value.length > field.maxLength) {
      return { error: field.label + " terlalu panjang, maksimal " + field.maxLength + " karakter." };
    }
    // The 3D scenes only have room for a few words inside the model.
    if (field.name === "centerText" && value && countWords(value) > 4) {
      return { error: "Ucapan di tengah maksimal 4 kata." };
    }
    if (value) payload[field.name] = value;
  }

  for (const group of schema.groups ?? []) {
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < group.count; i++) {
      const row: Record<string, string> = {};
      for (const field of group.fields) {
        const key = group.name + "." + i + "." + field.name;
        const value = String(formData.get(key) ?? "").trim();
        if (field.required && !value) {
          return { error: group.label + " " + (i + 1) + ": " + field.label + " wajib diisi." };
        }
        if (field.maxLength && value.length > field.maxLength) {
          return { error: group.label + " " + (i + 1) + ": " + field.label + " terlalu panjang." };
        }
        row[field.name] = value;
      }
      rows.push(row);
    }
    payload[group.name] = rows;
  }

  // The browser tells us which files it holds; only names travel here, not bytes.
  const photoNames = formData.getAll("photoNames").map((v) => String(v));
  const musicName = String(formData.get("musicName") ?? "").trim();

  const maxPhotos = schema.photos
    ? schema.photos.max
    : (schema.groups ?? []).filter((g) => g.withPhoto).reduce((a, g) => a + g.count, 0);

  if (photoNames.length > maxPhotos) {
    return { error: "Maksimal " + maxPhotos + " foto untuk template ini." };
  }
  if (schema.photos && photoNames.length < schema.photos.min) {
    return { error: "Minimal " + schema.photos.min + " foto untuk template ini." };
  }

  const slots: { slot: string; fileName: string }[] = [];
  photoNames.forEach((name, i) => {
    const ext = safeExtension(name, ALLOWED_IMAGE_EXT);
    if (ext) slots.push({ slot: "photo" + i, fileName: "photo" + i + "." + ext });
  });
  if (photoNames.length > 0 && slots.length !== photoNames.length) {
    return { error: "Ada foto dengan format yang tidak didukung. Pakai JPG, PNG, WEBP, atau HEIC." };
  }

  if (musicName) {
    const ext = safeExtension(musicName, ALLOWED_AUDIO_EXT);
    if (!ext) return { error: "Format musik tidak didukung. Pakai MP3, M4A, AAC, OGG, atau WAV." };
    slots.push({ slot: "music", fileName: "music." + ext });
  }

  // Random folder, not derived from the order slug, so a guessable gift URL
  // never reveals where the buyer's photos live.
  const assetFolder = newAssetFolder();
  payload.assetFolder = assetFolder;

  let orderSlug: string;
  let tickets: UploadTicket[] = [];
  try {
    orderSlug = await createOrder({
      templateSlug: template.slug,
      customerName,
      customerWhatsapp,
      priceIdr: template.price,
      payload,
      customSlug: customSlug || undefined,
    });
    if (slots.length > 0) {
      tickets = await createUploadTickets(assetFolder, slots);
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : "";
    return { error: "Pesanan gagal disimpan. " + detail };
  }

  return { error: null, ok: true, orderSlug, tickets };
}
