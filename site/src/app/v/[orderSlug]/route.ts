import { readFile } from "fs/promises";
import path from "path";
import { getOrderBySlug } from "@/lib/orders";
import { getTemplateBySlug } from "@/lib/templates";
import { mapOrderToConfig } from "@/lib/order-to-config";
import { renderTemplate } from "@/lib/render-template";

/**
 * Serves a paid order's personalised template as raw HTML.
 *
 * A route handler rather than a page on purpose: the templates are complete
 * standalone documents with their own <html>, inline CSS, Three.js and canvas
 * work. Rendering them through React would mean either escaping the markup or
 * dangerouslySetInnerHTML inside a wrapper document, and both break the
 * templates. Here the bytes go out untouched apart from the token swap.
 */

function htmlResponse(html: string, status: number): Response {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Personal gifts, not catalogue pages. Keep them out of search results.
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "private, no-store",
    },
  });
}

/**
 * Escape a value being dropped into a single quoted JavaScript string literal.
 *
 * asset_base is admin supplied, but "trusted input" is exactly how injection
 * bugs start. A stray apostrophe would break the script outright, and a
 * crafted value could close the string and run code, so escape rather than
 * assume the field is well formed.
 */
// Escaping now lives in lib/render-template.ts, shared with the tests.

function notActivePage(): Response {
  return htmlResponse(
    [
      "<!doctype html>",
      '<html lang="id"><head><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<meta name="robots" content="noindex, nofollow">',
      "<title>Link belum aktif</title><style>",
      "body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;",
      "background:#fdf6f4;color:#3a2a2e;font-family:system-ui,-apple-system,sans-serif;padding:24px;}",
      ".box{max-width:420px;text-align:center;}",
      "h1{font-size:22px;margin:0 0 12px;font-weight:600;}",
      "p{margin:0;line-height:1.6;color:#7a6167;font-size:15px;}",
      ".dot{width:44px;height:44px;border-radius:999px;background:#c89b6a;opacity:.25;margin:0 auto 20px;}",
      "</style></head><body><div class=\"box\">",
      '<div class="dot"></div>',
      "<h1>Link ini belum aktif</h1>",
      "<p>Pesanan ini belum kami tandai lunas. Kalau kamu sudah transfer, kirim bukti",
      " pembayaranmu lewat WhatsApp dan link ini akan aktif tidak lama lagi.</p>",
      "</div></body></html>",
    ].join(""),
    402, // Payment Required, which is literally the situation
  );
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ orderSlug: string }> },
) {
  const { orderSlug } = await ctx.params;

  const order = await getOrderBySlug(orderSlug);
  if (!order) {
    return htmlResponse("<!doctype html><title>404</title><h1>Tidak ditemukan</h1>", 404);
  }

  if (order.status !== "paid") {
    return notActivePage();
  }

  // template_slug comes from our own database, but resolving it against the
  // known catalogue means a bad value can never turn into a path like
  // "../../../etc/passwd" reaching readFile.
  const template = getTemplateBySlug(order.template_slug);
  if (!template) {
    return htmlResponse("<!doctype html><title>500</title><h1>Template tidak dikenal</h1>", 500);
  }

  // process.cwd() is the Next project root (site/), and the templates live one
  // level up. next.config.ts traces this folder into the deployment bundle.
  const file = path.join(process.cwd(), "..", "Template", template.slug, "index.html");

  let html: string;
  try {
    html = await readFile(file, "utf8");
  } catch {
    return htmlResponse("<!doctype html><title>500</title><h1>File template tidak terbaca</h1>", 500);
  }

  // The buyer's answers overwrite the template's own CONFIG defaults, so a
  // paid page shows their names and words rather than the demo content.
  const answers = (order.payload ?? {}) as Record<string, unknown>;
  const mapped = mapOrderToConfig(order.template_slug, answers);

  return htmlResponse(
    renderTemplate(html, {
      assetBase: order.asset_base ?? "",
      recipientName: mapped.recipientName,
      configFields: mapped.configFields,
      letterParagraphs: mapped.letterParagraphs,
    }),
    200,
  );
}
