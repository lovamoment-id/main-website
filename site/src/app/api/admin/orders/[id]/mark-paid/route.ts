import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isSessionTokenValid } from "@/lib/admin-auth";
import { markOrderPaid, setOrderAssetBase } from "@/lib/orders";

/**
 * Activates an order: stores asset_base, then flips it to paid.
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

  let assetBase = "";
  try {
    const body = (await request.json()) as { assetBase?: unknown };
    assetBase = typeof body.assetBase === "string" ? body.assetBase.trim() : "";
  } catch {
    return NextResponse.json({ error: "Body bukan JSON yang valid" }, { status: 400 });
  }

  if (!assetBase) {
    return NextResponse.json(
      { error: "asset_base wajib diisi sebelum order diaktifkan" },
      { status: 400 },
    );
  }

  // The template builds URLs as ASSET_BASE + "image1.jpg", so a missing
  // trailing slash silently produces ".../orderimage1.jpg". Normalise instead
  // of leaving that as a trap for whoever fills the field at 1am.
  const normalised = assetBase.endsWith("/") ? assetBase : assetBase + "/";

  try {
    // asset_base first: if this fails the order stays pending and can be
    // retried, which is safer than a paid order pointing at nothing.
    await setOrderAssetBase(id, normalised);
    const order = await markOrderPaid(id);

    return NextResponse.json({
      ok: true,
      orderSlug: order.order_slug,
      status: order.status,
      paidAt: order.paid_at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
