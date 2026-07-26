import { ImageResponse } from "next/og";

export const alt = "Lovamoment.id: Hadiah Digital Personal untuk Orang Tersayang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Same tokens as globals.css. Satori (the renderer behind ImageResponse)
   can't read CSS custom properties, so the brand colors are inlined here. */
const PRIMARY = "#9e3b52";
const ACCENT = "#c89b6a";
const BG = "#fdf6f4";
const TEXT = "#3a2a2e";
const TEXT_MUTED = "#7a6167";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(circle at 50% -10%, rgba(158,59,82,0.16), transparent 60%)`,
        }}
      >
        {/* Satori inserts a space wherever text is split across two flex items,
            regardless of gap or whitespace, so ".id" is pulled back to sit flush
            against the wordmark the way Header/Footer render it in the browser. */}
        <div style={{ display: "flex", fontSize: 96, fontWeight: 600, color: TEXT }}>
          <span>Lovamoment</span>
          <span style={{ color: PRIMARY, marginLeft: -18 }}>.id</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: TEXT_MUTED,
            textAlign: "center",
          }}
        >
          Hadiah Digital Personal untuk Orang Tersayang
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            width: 120,
            height: 4,
            borderRadius: 999,
            backgroundColor: ACCENT,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
