import "server-only";

import { randomBytes } from "crypto";
import { getSupabase } from "@/lib/supabase";

/**
 * Buyer asset storage.
 *
 * Uploads go from the browser straight to Supabase, never through our own
 * server. That is not a preference: production rejects request bodies over
 * roughly 4.5 MB with a 413 before our code runs (measured: 4 MB passes,
 * 5 MB does not), and a single iPhone photo can exceed that on its own.
 *
 * The bucket is public because templates fetch assets as plain
 * ASSET_BASE + "image1.jpg" from the recipient's browser, and signed URLs
 * would expire, which contradicts the promise that a gift link keeps working.
 * Privacy comes from the folder name instead: every order gets a random token
 * that is not derived from the order slug, so a guessable URL like
 * /v/zia-dan-leo reveals nothing about where the photos live.
 */

export const BUCKET = "orders";

/** Random, unguessable folder name for one order's assets. */
export function newAssetFolder(): string {
  return randomBytes(18).toString("base64url");
}

/** Canonical file names the templates expect. */
export function photoFileName(index: number, ext = "jpg"): string {
  return "image" + (index + 1) + "." + ext;
}
export const MUSIC_FILE_NAME = "music.mp3";

/** Where uploads land before conversion, kept apart from the served names. */
export function rawPath(folder: string, fileName: string): string {
  return folder + "/raw/" + fileName;
}
export function finalPath(folder: string, fileName: string): string {
  return folder + "/" + fileName;
}

/** Public folder URL, ready to be used as asset_base. Always ends in a slash. */
export function assetBaseUrl(folder: string): string {
  const base = process.env.SUPABASE_URL;
  if (!base) throw new Error("SUPABASE_URL belum diset.");
  return base + "/storage/v1/object/public/" + BUCKET + "/" + folder + "/";
}

export type UploadTicket = {
  /** Field this ticket belongs to: "photo0".."photoN" or "music". */
  slot: string;
  path: string;
  /** One time upload URL the browser PUTs to. */
  signedUrl: string;
  token: string;
};

/**
 * Issue one time upload URLs for the slots an order needs.
 *
 * The extension is kept from the buyer's own file so a HEIC arrives as HEIC and
 * can be converted later; renaming to .jpg here would lie about the contents.
 */
export async function createUploadTickets(
  folder: string,
  slots: { slot: string; fileName: string }[],
): Promise<UploadTicket[]> {
  const supabase = getSupabase();
  const tickets: UploadTicket[] = [];

  for (const { slot, fileName } of slots) {
    const path = rawPath(folder, fileName);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      throw new Error("Gagal menyiapkan unggahan " + slot + ": " + (error?.message ?? ""));
    }
    tickets.push({ slot, path, signedUrl: data.signedUrl, token: data.token });
  }

  return tickets;
}

export async function downloadRaw(path: string): Promise<Buffer> {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) {
    throw new Error("Gagal mengunduh " + path + ": " + (error?.message ?? ""));
  }
  return Buffer.from(await data.arrayBuffer());
}

export async function uploadFinal(
  path: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType,
    upsert: true, // re-running conversion for one order must not fail
  });
  if (error) throw new Error("Gagal mengunggah " + path + ": " + error.message);
}

export async function listFolder(prefix: string): Promise<string[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix);
  if (error) throw new Error("Gagal membaca folder: " + error.message);
  return (data ?? []).map((f) => f.name);
}
