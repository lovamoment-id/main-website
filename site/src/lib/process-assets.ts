import "server-only";

import sharp from "sharp";
import {
  MUSIC_FILE_NAME,
  downloadRaw,
  finalPath,
  listFolder,
  photoFileName,
  uploadFinal,
} from "@/lib/storage";

/**
 * Turns a buyer's raw uploads into the exact file names templates expect.
 *
 * Runs on the server but reads from Storage rather than a request body, so the
 * 4.5 MB request limit that rules out uploading through our server does not
 * apply here.
 */

/** Long edge cap. Beyond this is wasted bytes on a phone screen. */
const MAX_EDGE = 2000;
const JPEG_QUALITY = 82;

const AUDIO_EXTENSIONS = new Set(["mp3", "m4a", "aac", "mp4", "ogg", "wav"]);

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

export type ProcessResult = {
  /** How many photos ended up as image1.jpg, image2.jpg and so on. */
  photoCount: number;
  /**
   * Actual music file name, or null when no music was uploaded.
   *
   * Audio is not transcoded: sharp handles images only, and ffmpeg is not
   * available here. Rather than rename an m4a to music.mp3 and hope the
   * browser sniffs it, the real extension is kept and CONFIG.musicFile is
   * pointed at it, which every template reads.
   */
  musicFileName: string | null;
  warnings: string[];
};

/**
 * Convert every raw upload in a folder into its served counterpart.
 *
 * Photos become sequential JPEGs because every template tries .jpg first, and
 * HEIC from an iPhone would otherwise fail to render on Android at all.
 */
export async function processOrderAssets(folder: string): Promise<ProcessResult> {
  const rawNames = await listFolder(folder + "/raw");
  const warnings: string[] = [];

  // "photo0".."photoN" sort numerically, not lexically, so photo10 does not
  // land between photo1 and photo2.
  const photos = rawNames
    .filter((n) => n.startsWith("photo"))
    .sort((a, b) => {
      const na = parseInt(a.replace(/[^0-9]/g, ""), 10);
      const nb = parseInt(b.replace(/[^0-9]/g, ""), 10);
      return na - nb;
    });

  let photoCount = 0;
  for (const name of photos) {
    const raw = await downloadRaw(folder + "/raw/" + name);
    try {
      const jpeg = await sharp(raw)
        .rotate() // honours EXIF orientation, otherwise phone photos come out sideways
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();

      await uploadFinal(finalPath(folder, photoFileName(photoCount)), jpeg, "image/jpeg");
      photoCount++;
    } catch (err) {
      const detail = err instanceof Error ? err.message : "tidak diketahui";
      warnings.push("Foto " + name + " gagal diproses: " + detail);
    }
  }

  let musicFileName: string | null = null;
  const music = rawNames.find((n) => n.startsWith("music"));
  if (music) {
    const ext = extensionOf(music);
    if (!AUDIO_EXTENSIONS.has(ext)) {
      warnings.push("Berkas musik " + music + " formatnya tidak dikenali, dilewati.");
    } else {
      const raw = await downloadRaw(folder + "/raw/" + music);
      // mp3 keeps the canonical name so templates that hardcode it still work.
      musicFileName = ext === "mp3" ? MUSIC_FILE_NAME : "music." + ext;
      const type = ext === "mp3" ? "audio/mpeg" : ext === "wav" ? "audio/wav" : "audio/mp4";
      await uploadFinal(finalPath(folder, musicFileName), raw, type);
    }
  }

  return { photoCount, musicFileName, warnings };
}
