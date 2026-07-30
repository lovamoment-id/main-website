import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isSessionTokenValid } from "@/lib/admin-auth";
import { getOrderById, markOrderPaid, setOrderAssetBase } from "@/lib/orders";
import { processOrderAssets } from "@/lib/process-assets";
import { assetBaseUrl } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase";

/**
 * Activates an order: converts the buyer's uploads, then flips it to paid.
 *
 * The session is re-checked here even though proxy.ts already gates
 * /api/admin/*. The Next docs are explicit that Proxy is not a substitute for
 * authorisation, and this endpoint changes state, so it verifies for itself
 * rather than trusting that a matcher upstream was configured correctly.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  if (!isSessionTokenValid(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let manualAssetBase = "";
  try {
    const body = (await request.json()) as { assetBase?: unknown };
    manualAssetBase = typeof body.assetBase === "string" ? body.assetBase.trim() : "";
  } catch {
    return NextResponse.json({ error: "Body bukan JSON yang valid" }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  const payload = (order.payload ?? {}) as Record<string, unknown>;
  const assetFolder = typeof payload.assetFolder === "string" ? payload.assetFolder : null;

  const warnings: string[] = [];
  let assetBase = manualAssetBase;

  if (assetFolder) {
    // The buyer uploaded through the form, so convert what they sent and point
    // asset_base at the result. Reading from Storage rather than a request body
    // keeps this clear of the 4.5 MB limit that rules out server side uploads.
    try {
      const result = await processOrderAssets(assetFolder);
      warnings.push(...result.warnings);
      assetBase = assetBaseUrl(assetFolder);

      // Audio is never transcoded, so tell the template the real file name
      // instead of renaming an m4a to music.mp3 and hoping it plays.
      if (result.musicFileName && result.musicFileName !== "music.mp3") {
        const supabase = getSupabase();
        const nextPayload = { ...payload, resolvedMusicFile: result.musicFileName };
        const { error } = await supabase
          .from("orders")
          .update({ payload: nextPayload })
          .eq("id", id);
        if (error) warnings.push("Gagal menyimpan nama berkas musik: " + error.message);
      }

      if (result.photoCount === 0 && !result.musicFileName) {
        warnings.push("Tidak ada berkas yang berhasil diproses untuk pesanan ini.");
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : "gagal";
      return NextResponse.json(
        { error: "Gagal memproses berkas pembeli: " + detail },
        { status: 500 },
      );
    }
  }

  if (!assetBase) {
    return NextResponse.json(
      { error: "Pesanan ini tidak punya berkas terunggah. Isi asset base secara manual." },
      { status: 400 },
    );
  }

  // Templates build URLs as ASSET_BASE + "image1.jpg", so a missing trailing
  // slash silently produces ".../orderimage1.jpg".
  const normalised = assetBase.endsWith("/") ? assetBase : assetBase + "/";

  try {
    // asset_base first: if this fails the order stays pending and can be
    // retried, which is safer than a paid order pointing at nothing.
    await setOrderAssetBase(id, normalised);
    const paid = await markOrderPaid(id);

    return NextResponse.json({
      ok: true,
      orderSlug: paid.order_slug,
      status: paid.status,
      paidAt: paid.paid_at,
      assetBase: normalised,
      warnings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
