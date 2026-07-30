import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client holding the service_role key.
 *
 * The `server-only` import above turns any accidental client component import
 * into a build error, which matters here: service_role bypasses row level
 * security, so leaking it into a browser bundle would expose every customer
 * name and WhatsApp number in the orders table.
 */

export type OrderStatus = "pending" | "paid";

export type OrderRow = {
  id: string;
  created_at: string;
  order_slug: string;
  template_slug: string;
  status: OrderStatus;
  customer_name: string | null;
  customer_whatsapp: string | null;
  price_idr: number | null;
  payload: OrderPayload | null;
  asset_base: string | null;
  paid_at: string | null;
  admin_note: string | null;
};

/**
 * Answers captured by the public order form.
 *
 * Deliberately open ended: the questions differ per template (see
 * lib/order-schema.ts), so the shape is validated against that schema on the
 * way in rather than pinned down here.
 */
export type OrderPayload = Record<string, unknown>;

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  // Supabase renamed these: the "Secret key" (sb_secret_...) is what used to be
  // called the service_role key. Both names are accepted so an older .env keeps
  // working.
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Fail loudly at the call site rather than letting Supabase throw a vaguer
  // error deeper in a request that the visitor would see as a blank 500.
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diset. Lihat .env.example.",
    );
  }

  // Catches the placeholder from .env.example being left in place. Without
  // this the failure surfaces as Supabase's own "Invalid supabaseUrl", which
  // does not hint at which file to go fix.
  if (!/^https?:\/\//.test(url)) {
    throw new Error(
      "SUPABASE_URL harus berupa URL lengkap seperti https://xxx.supabase.co, " +
        "bukan placeholder. Periksa .env.local.",
    );
  }

  // Easy mistake: the dashboard also shows a REST endpoint ending in /rest/v1.
  // supabase-js appends that path itself, so pasting it here doubles up and
  // PostgREST answers PGRST125 "Invalid path specified in request URL", which
  // gives no clue about the real cause.
  if (/\/rest\/v\d/.test(url)) {
    throw new Error(
      "SUPABASE_URL berisi /rest/v1. Pakai Project URL saja " +
        "(https://xxx.supabase.co), tanpa path REST.",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
