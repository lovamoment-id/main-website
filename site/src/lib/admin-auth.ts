import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed admin session cookie.
 *
 * The cookie holds `expiry.signature`, never the password itself. If the cookie
 * leaks (shared laptop, browser extension, a screenshot), the attacker gets a
 * token that expires, not a permanent credential, and cannot recover
 * ADMIN_PASSWORD from it. Rotating ADMIN_SESSION_SECRET invalidates every
 * outstanding session at once.
 *
 * This is deliberately stateless: no session table, so it stays as simple as a
 * plain password check while avoiding the plaintext-cookie problem.
 */

export const ADMIN_COOKIE = "admin_session";

const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error("ADMIN_SESSION_SECRET belum diset. Lihat .env.example.");
  }
  return value;
}

function sign(expiresAt: number): string {
  return createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");
}

/** Constant time compare so a wrong token cannot be narrowed down by timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isPasswordCorrect(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD belum diset. Lihat .env.example.");
  }
  return safeEqual(input, expected);
}

export function createSessionToken(now: number = Date.now()): string {
  const expiresAt = now + SESSION_MS;
  return expiresAt + "." + sign(expiresAt);
}

export function isSessionTokenValid(token: string | undefined, now: number = Date.now()): boolean {
  if (!token) return false;

  const dot = token.indexOf(".");
  if (dot < 1) return false;

  const expiresAtRaw = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;

  return safeEqual(signature, sign(expiresAt));
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_MS / 1000;
