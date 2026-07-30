"use client";

import { useRef, useState } from "react";

/**
 * Photo and music pickers.
 *
 * The chosen File objects stay in this component's state; only their names
 * travel with the form POST, because production rejects request bodies over
 * roughly 4.5 MB and one phone photo can exceed that on its own. The parent
 * uploads the bytes straight to Supabase after the action returns tickets.
 */

export type PickedFiles = { photos: File[]; music: File | null };

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";
const AUDIO_ACCEPT = "audio/*,.mp3,.m4a,.aac,.ogg,.wav";

/** Matches the bucket's own 20 MB ceiling, checked here so the buyer finds out
 *  before waiting for a long upload to be rejected. */
const MAX_BYTES = 20 * 1024 * 1024;

function humanSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? Math.round(bytes / 1024) + " KB"
    : (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function FileSlots({
  maxPhotos,
  minPhotos,
  photoHelp,
  supportsMusic,
  musicHelp,
  onChange,
  disabled,
}: {
  maxPhotos: number;
  minPhotos: number;
  photoHelp: string;
  supportsMusic: boolean;
  musicHelp?: string;
  onChange: (picked: PickedFiles) => void;
  disabled: boolean;
}) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [music, setMusic] = useState<File | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const musicInput = useRef<HTMLInputElement>(null);

  function publish(next: PickedFiles) {
    setPhotos(next.photos);
    setMusic(next.music);
    onChange(next);
  }

  function addPhotos(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setWarning("Berkas " + tooBig.name + " terlalu besar (" + humanSize(tooBig.size) + "). Maksimal 20 MB per berkas.");
      return;
    }
    const combined = [...photos, ...incoming].slice(0, maxPhotos);
    if (photos.length + incoming.length > maxPhotos) {
      setWarning("Template ini menerima maksimal " + maxPhotos + " foto, jadi sisanya tidak dipakai.");
    } else {
      setWarning(null);
    }
    publish({ photos: combined, music });
    if (photoInput.current) photoInput.current.value = "";
  }

  function removePhoto(index: number) {
    publish({ photos: photos.filter((_, i) => i !== index), music });
    setWarning(null);
  }

  function pickMusic(list: FileList | null) {
    const file = list?.[0] ?? null;
    if (file && file.size > MAX_BYTES) {
      setWarning("Berkas musik terlalu besar (" + humanSize(file.size) + "). Maksimal 20 MB.");
      return;
    }
    setWarning(null);
    publish({ photos, music: file });
  }

  if (maxPhotos === 0 && !supportsMusic) return null;

  return (
    <fieldset className="flex flex-col gap-5 border-t border-primary/10 pt-6">
      <legend className="mb-2 font-display text-lg font-semibold text-text">Foto dan musik</legend>

      {/* The names are what the server reads, to work out each file extension. */}
      {photos.map((f, i) => (
        <input key={i} type="hidden" name="photoNames" value={f.name} />
      ))}
      {music && <input type="hidden" name="musicName" value={music.name} />}

      {maxPhotos > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-text">
            Foto{" "}
            <span className="font-normal text-text-muted">
              ({photos.length} dari {maxPhotos})
            </span>
          </span>

          {photos.length > 0 && (
            <ul className="flex flex-col gap-2">
              {photos.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl bg-bg px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate text-text">
                    <span className="mr-2 font-mono text-xs text-text-muted">{i + 1}.</span>
                    {f.name}
                  </span>
                  <span className="shrink-0 text-xs text-text-muted">{humanSize(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    disabled={disabled}
                    className="shrink-0 rounded-full px-2 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}

          {photos.length < maxPhotos && (
            <label className="cursor-pointer rounded-xl border border-dashed border-primary/30 px-4 py-6 text-center text-sm text-text-muted transition-colors hover:border-primary/50">
              <input
                ref={photoInput}
                type="file"
                accept={IMAGE_ACCEPT}
                multiple={maxPhotos > 1}
                disabled={disabled}
                onChange={(e) => addPhotos(e.target.files)}
                className="hidden"
              />
              Ketuk untuk memilih foto
            </label>
          )}

          <span className="text-xs text-text-muted">
            {photoHelp} Urutan di atas menentukan urutan tampil.
            {minPhotos > 0 && " Minimal " + minPhotos + " foto."}
            {" Foto dari iPhone (HEIC) otomatis kami ubah supaya bisa dibuka di semua HP."}
          </span>
        </div>
      )}

      {supportsMusic && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-text">
            Musik <span className="font-normal text-text-muted">(opsional)</span>
          </span>
          {music ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-bg px-4 py-2.5 text-sm">
              <span className="min-w-0 flex-1 truncate text-text">{music.name}</span>
              <span className="shrink-0 text-xs text-text-muted">{humanSize(music.size)}</span>
              <button
                type="button"
                onClick={() => {
                  publish({ photos, music: null });
                  if (musicInput.current) musicInput.current.value = "";
                }}
                disabled={disabled}
                className="shrink-0 rounded-full px-2 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          ) : (
            <label className="cursor-pointer rounded-xl border border-dashed border-primary/30 px-4 py-5 text-center text-sm text-text-muted transition-colors hover:border-primary/50">
              <input
                ref={musicInput}
                type="file"
                accept={AUDIO_ACCEPT}
                disabled={disabled}
                onChange={(e) => pickMusic(e.target.files)}
                className="hidden"
              />
              Ketuk untuk memilih lagu
            </label>
          )}
          <span className="text-xs text-text-muted">{musicHelp}</span>
        </div>
      )}

      {warning && (
        <p role="alert" className="text-sm font-medium text-primary">
          {warning}
        </p>
      )}
    </fieldset>
  );
}
