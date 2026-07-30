import { getSchema, type TemplateSchema } from "@/lib/order-schema";
import { splitParagraphs } from "@/lib/render-template";

/**
 * Maps one order's answers onto the CONFIG properties its template expects.
 *
 * The schema decides what goes where, so this file holds only the handful of
 * shapes that cannot be expressed as a plain key rename: per-line lists,
 * repeating groups, and the two derived values (letter-vintage's wax seal and
 * gacha-love's combined name plate).
 */

export type OrderAnswers = Record<string, unknown>;

/** Textareas that stand in for arrays: one entry per non-empty line. */
function linesToArray(value: unknown): string[] | undefined {
  if (typeof value !== "string") return undefined;
  const lines = splitParagraphs(value);
  return lines.length > 0 ? lines : undefined;
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

/** Fields whose CONFIG value is a list built from one line per entry. */
const LINE_LIST_FIELDS = new Set(["lovePoints", "prayers", "wishes"]);

/** Templates whose letter lives in CONFIG rather than in #letter-source. */
const LETTER_AS_CONFIG: Record<string, string> = {
  "claw-machine": "letterParagraphs",
  "gacha-love": "letterBody",
};

export type MappedOrder = {
  /** Written over the template's CONFIG. */
  configFields: Record<string, unknown>;
  /** Replaces #letter-source, empty when the template keeps its letter in CONFIG. */
  letterParagraphs: string[];
  /** Drives the browser tab title. */
  recipientName: string;
};

export function mapOrderToConfig(
  templateSlug: string,
  answers: OrderAnswers,
): MappedOrder {
  const schema: TemplateSchema | undefined = getSchema(templateSlug);
  if (!schema) {
    return { configFields: {}, letterParagraphs: [], recipientName: "" };
  }

  const configFields: Record<string, unknown> = {};
  let letterParagraphs: string[] = [];

  for (const field of schema.fields) {
    const raw = answers[field.name];

    if (field.kind === "letter") {
      const paragraphs = linesToArray(raw) ?? [];
      const configKey = LETTER_AS_CONFIG[templateSlug];
      if (configKey) {
        // These templates render the letter from CONFIG, so it stays an array.
        if (paragraphs.length > 0) configFields[configKey] = paragraphs;
      } else {
        letterParagraphs = paragraphs;
      }
      continue;
    }

    if (!field.configKey) continue;

    if (LINE_LIST_FIELDS.has(field.name)) {
      const list = linesToArray(raw);
      if (list) configFields[field.configKey] = list;
      continue;
    }

    const value = asString(raw);
    if (value !== undefined) configFields[field.configKey] = value;
  }

  // Repeating groups: our-night-sky memories, scratch-card cards, gacha-love
  // photo captions. Each entry already carries its own photo by position.
  for (const group of schema.groups ?? []) {
    const rows = answers[group.name];
    if (!Array.isArray(rows) || rows.length === 0 || !group.configKey) continue;

    if (templateSlug === "gacha-love") {
      // This template wants a flat list of captions, not objects.
      configFields[group.configKey] = rows.map((r) =>
        asString((r as Record<string, unknown>).caption) ?? "",
      );
      continue;
    }

    if (templateSlug === "our-night-sky") {
      // Keep the template's own x/y star positions; only the text changes.
      configFields[group.configKey] = rows.map((r, i) => {
        const row = r as Record<string, unknown>;
        return {
          x: [22, 44, 68, 78, 34][i] ?? 50,
          y: [26, 44, 30, 56, 60][i] ?? 40,
          label: asString(row.label) ?? "",
          date: asString(row.date) ?? "",
          note: asString(row.note) ?? "",
          image: "image" + (i + 1),
        };
      });
      continue;
    }

    if (templateSlug === "scratch-card") {
      configFields[group.configKey] = rows.map((r, i) => {
        const row = r as Record<string, unknown>;
        return {
          kicker: "Kartu " + String(i + 1).padStart(2, "0"),
          title: asString(row.title) ?? "",
          message: asString(row.message) ?? "",
        };
      });
      continue;
    }
  }

  const recipientName = asString(answers[schema.recipientField]) ?? "";

  // Two derived values the buyer is never asked for directly.
  if (templateSlug === "letter-vintage" && recipientName) {
    configFields.sealInitial = recipientName.charAt(0).toUpperCase();
  }
  if (templateSlug === "gacha-love") {
    const sender = asString(answers.senderName);
    if (sender && recipientName) {
      configFields.names = sender + " & " + recipientName;
      configFields.letterSign = sender;
    }
  }

  return { configFields, letterParagraphs, recipientName };
}
