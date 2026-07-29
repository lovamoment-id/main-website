import "server-only";

import { randomBytes } from "crypto";
import { getSupabase, type OrderPayload, type OrderRow } from "@/lib/supabase";

/** Slug suffix alphabet. No vowels, so a random run cannot spell a real word,
 *  and no 0/1/i/l/o to survive being read aloud over WhatsApp. */
const SUFFIX_ALPHABET = "23456789bcdfghjkmnpqrstvwxyz";
const SUFFIX_LENGTH = 4;
const MAX_SLUG_ATTEMPTS = 8;

function randomSuffix(): string {
  const bytes = randomBytes(SUFFIX_LENGTH);
  let out = "";
  for (let i = 0; i < SUFFIX_LENGTH; i++) {
    out += SUFFIX_ALPHABET[bytes[i] % SUFFIX_ALPHABET.length];
  }
  return out;
}

/** Strip a display name down to something safe to put in a URL. */
function nameToSlugPart(customerName: string): string {
  const cleaned = customerName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // drop combining accent marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20)
    .replace(/-+$/g, "");

  // Someone whose name is entirely non-latin (or empty) still needs a slug.
  return cleaned.length > 0 ? cleaned : "order";
}

/**
 * Build a slug like "rangga-k7mp" that is not already taken.
 *
 * Async because uniqueness can only be answered by the database. The unique
 * index on order_slug is still the real guarantee: this loop just avoids
 * surfacing a constraint violation to the customer in the common case.
 */
export async function generateOrderSlug(customerName: string): Promise<string> {
  const base = nameToSlugPart(customerName);
  const supabase = getSupabase();

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const candidate = base + "-" + randomSuffix();

    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("order_slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error("Gagal memeriksa slug order: " + error.message);
    }
    if (!data) {
      return candidate;
    }
  }

  throw new Error(
    "Tidak menemukan slug unik setelah " + MAX_SLUG_ATTEMPTS + " percobaan.",
  );
}

export type CreateOrderInput = {
  templateSlug: string;
  customerName: string;
  customerWhatsapp: string;
  priceIdr: number;
  payload: OrderPayload;
};

/** Insert a pending order and return its slug. */
export async function createOrder(input: CreateOrderInput): Promise<string> {
  const supabase = getSupabase();
  const orderSlug = await generateOrderSlug(input.customerName);

  const { error } = await supabase.from("orders").insert({
    order_slug: orderSlug,
    template_slug: input.templateSlug,
    status: "pending",
    customer_name: input.customerName,
    customer_whatsapp: input.customerWhatsapp,
    price_idr: input.priceIdr,
    payload: input.payload,
  });

  if (error) {
    throw new Error("Gagal menyimpan order: " + error.message);
  }

  return orderSlug;
}

/**
 * The one and only place that flips an order to 'paid'.
 *
 * Kept deliberately narrow so a future Midtrans webhook can call exactly this
 * function without touching anything else. The `.eq("status", "pending")` guard
 * makes it idempotent: a webhook that fires twice updates one row the first
 * time and zero rows the second, and the second call still returns the paid
 * order rather than an error.
 */
export async function markOrderPaid(orderId: string): Promise<OrderRow> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "pending")
    .select()
    .maybeSingle();

  if (error) {
    throw new Error("Gagal menandai order lunas: " + error.message);
  }

  if (data) {
    return data as OrderRow;
  }

  // No row updated: either the id is unknown, or it was already paid.
  const existing = await getOrderById(orderId);
  if (!existing) {
    throw new Error("Order tidak ditemukan: " + orderId);
  }
  return existing;
}

export async function getOrderById(orderId: string): Promise<OrderRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal mengambil order: " + error.message);
  }
  return (data as OrderRow | null) ?? null;
}

export async function getOrderBySlug(orderSlug: string): Promise<OrderRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_slug", orderSlug)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal mengambil order: " + error.message);
  }
  return (data as OrderRow | null) ?? null;
}

export async function listOrders(): Promise<OrderRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Gagal mengambil daftar order: " + error.message);
  }
  return (data as OrderRow[] | null) ?? [];
}

/** Set by the admin before activating, so /v/[slug] knows where assets live. */
export async function setOrderAssetBase(
  orderId: string,
  assetBase: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ asset_base: assetBase })
    .eq("id", orderId);

  if (error) {
    throw new Error("Gagal menyimpan asset_base: " + error.message);
  }
}
