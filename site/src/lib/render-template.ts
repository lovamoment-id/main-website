/**
 * Turns a stock template file into one buyer's personalised page.
 *
 * Everything happens as string substitution on the raw HTML, never by parsing
 * it into a DOM or rendering through React. The templates are complete
 * standalone documents with inline Three.js, canvas work and their own
 * <html>, and any of those steps would break them.
 *
 * Four substitutions, in this order:
 *   1. __LOVAMOMENT_ASSET_BASE__  -> the buyer's asset folder URL
 *   2. <title>                    -> "For <recipient>"
 *   3. __LOVAMOMENT_ORDER_FIELDS__ -> CONFIG.x = y; overrides
 *   4. #letter-source contents    -> the buyer's letter paragraphs
 */

export const ASSET_BASE_TOKEN = "__LOVAMOMENT_ASSET_BASE__";
export const ORDER_FIELDS_TOKEN = "/* __LOVAMOMENT_ORDER_FIELDS__ */";

/**
 * Escape for a single quoted JavaScript string literal.
 *
 * The "<" rule is the important one: without it a value containing
 * "</script>" would end the inline script block early and the rest of the
 * template would render as text.
 */
export function escapeForJsString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\x3c");
}

/**
 * Serialise any CONFIG value as a JavaScript literal.
 *
 * JSON.stringify handles strings, numbers, booleans and arrays correctly, but
 * it happily emits a literal "</script>" inside a string, so those characters
 * are escaped afterwards. The result stays valid JSON and valid JavaScript.
 */
export function toJsLiteral(value: unknown): string {
  return JSON.stringify(value ?? null)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028") // line separators are literal newlines in JS
    .replace(/\u2029/g, "\\u2029");
}

/** Escape text being placed into HTML body content. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Split a buyer's free-text letter into paragraphs.
 *
 * Buyers are told to press Enter for a new paragraph, so a single newline
 * counts as a break. Runs of blank lines collapse rather than producing empty
 * paragraphs that would render as odd gaps.
 */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export type RenderInput = {
  /** Folder URL for the buyer's uploaded assets. Always ends with a slash. */
  assetBase: string;
  /** Shown in the browser tab as "For <name>". Skipped when empty. */
  recipientName?: string;
  /** Values written over the template's own CONFIG defaults. */
  configFields?: Record<string, unknown>;
  /** Replaces the paragraphs inside #letter-source. Skipped when empty. */
  letterParagraphs?: string[];
};

function replaceTitle(html: string, recipientName: string): string {
  // Only the first <title> is touched; templates have exactly one, but being
  // explicit avoids surprises if a stray one ever appears in inline SVG.
  return html.replace(
    /<title>[\s\S]*?<\/title>/i,
    "<title>For " + escapeHtml(recipientName) + "</title>",
  );
}

function replaceOrderFields(html: string, fields: Record<string, unknown>): string {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    // Leave the marker removed rather than in place, so a stray token never
    // reaches the browser as a visible comment.
    return html.split(ORDER_FIELDS_TOKEN).join("");
  }
  const lines = entries
    .map(([key, value]) => "CONFIG[" + toJsLiteral(key) + "] = " + toJsLiteral(value) + ";")
    .join("\n");
  return html.split(ORDER_FIELDS_TOKEN).join(lines);
}

function replaceLetter(html: string, paragraphs: string[]): string {
  const body = paragraphs.map((p) => "<p>" + escapeHtml(p) + "</p>").join("\n");

  // Matches the opening tag with any attribute order, then everything up to
  // the matching close. The templates never nest a div inside letter-source,
  // which is what makes the non-greedy match safe here.
  return html.replace(
    /(<div[^>]*id="letter-source"[^>]*>)[\s\S]*?(<\/div>)/i,
    (_full, open: string, close: string) => open + "\n" + body + "\n" + close,
  );
}

export function renderTemplate(html: string, input: RenderInput): string {
  let out = html.split(ASSET_BASE_TOKEN).join(escapeForJsString(input.assetBase));

  if (input.recipientName && input.recipientName.trim()) {
    out = replaceTitle(out, input.recipientName.trim());
  }

  out = replaceOrderFields(out, input.configFields ?? {});

  if (input.letterParagraphs && input.letterParagraphs.length > 0) {
    out = replaceLetter(out, input.letterParagraphs);
  }

  return out;
}
