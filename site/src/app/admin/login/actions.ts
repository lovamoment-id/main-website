"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  createSessionToken,
  isPasswordCorrect,
} from "@/lib/admin-auth";

export type LoginState = { error: string | null };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/orders");

  if (!isPasswordCorrect(password)) {
    // Deliberately vague: no hint about whether the password was close.
    return { error: "Password salah." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true, // keeps the token out of reach of any script on the page
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  // Only allow same-site relative paths, so ?next= cannot bounce the admin to
  // another domain after a successful login.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin/orders";
  redirect(safeNext);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
