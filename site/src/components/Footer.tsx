import Link from "next/link";
import { INSTAGRAM_URL, INSTAGRAM_USERNAME, TIKTOK_URL, TIKTOK_USERNAME } from "@/lib/social";
import { waLink } from "@/lib/whatsapp";

const SOCIALS = [
  {
    name: "WhatsApp",
    handle: "Chat langsung",
    href: waLink("Halo Lovamoment.id, aku mau tanya-tanya soal template hadiahnya 😊"),
    path: "M16.02 3C9.4 3 4 8.4 4 15.02c0 2.35.66 4.55 1.8 6.44L4 29l7.72-1.76a12.9 12.9 0 0 0 4.3.74C22.64 28 28 22.6 28 15.98 28 9.36 22.64 3 16.02 3Zm0 23.24c-1.5 0-2.94-.4-4.2-1.14l-.3-.18-4.58 1.04 1.08-4.46-.2-.32a10.14 10.14 0 0 1-1.6-5.44c0-5.62 4.58-10.2 10.2-10.2 5.62 0 10.2 4.58 10.2 10.2 0 5.62-4.58 10.5-10.6 10.5Zm5.6-7.64c-.3-.16-1.8-.9-2.08-1-.28-.1-.48-.16-.68.16-.2.3-.78 1-.96 1.2-.18.2-.36.24-.66.08-.3-.16-1.28-.48-2.44-1.52-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.14-.62.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.06-.38-.02-.54-.08-.16-.68-1.66-.94-2.26-.24-.6-.5-.5-.68-.5h-.58c-.2 0-.52.08-.8.38-.28.3-1.04 1-1.04 2.48s1.06 2.9 1.2 3.1c.14.2 2.1 3.24 5.1 4.54.72.3 1.28.5 1.72.64.72.22 1.38.2 1.9.12.58-.08 1.8-.72 2.06-1.42.26-.7.26-1.3.18-1.42-.08-.14-.28-.22-.58-.36Z",
  },
  {
    name: "Instagram",
    handle: "@" + INSTAGRAM_USERNAME,
    href: INSTAGRAM_URL,
    path: "M16 3c-3.53 0-3.97.015-5.356.078-1.384.063-2.329.283-3.156.605a6.37 6.37 0 0 0-2.302 1.503 6.37 6.37 0 0 0-1.503 2.302c-.322.827-.542 1.772-.605 3.156C3.015 12.03 3 12.47 3 16s.015 3.97.078 5.356c.063 1.384.283 2.329.605 3.156a6.37 6.37 0 0 0 1.503 2.302 6.37 6.37 0 0 0 2.302 1.503c.827.322 1.772.542 3.156.605C12.03 28.985 12.47 29 16 29s3.97-.015 5.356-.078c1.384-.063 2.329-.283 3.156-.605a6.37 6.37 0 0 0 2.302-1.503 6.37 6.37 0 0 0 1.503-2.302c.322-.827.542-1.772.605-3.156C28.985 19.97 29 19.53 29 16s-.015-3.97-.078-5.356c-.063-1.384-.283-2.329-.605-3.156a6.37 6.37 0 0 0-1.503-2.302 6.37 6.37 0 0 0-2.302-1.503c-.827-.322-1.772-.542-3.156-.605C19.97 3.015 19.53 3 16 3Zm0 2.343c3.47 0 3.88.013 5.25.075 1.267.058 1.955.27 2.413.448.607.236 1.04.518 1.495.972.454.455.736.888.972 1.495.178.458.39 1.146.448 2.413.062 1.37.075 1.78.075 5.254s-.013 3.884-.075 5.254c-.058 1.267-.27 1.955-.448 2.413a4.03 4.03 0 0 1-.972 1.495 4.03 4.03 0 0 1-1.495.972c-.458.178-1.146.39-2.413.448-1.37.062-1.78.075-5.25.075s-3.88-.013-5.25-.075c-1.267-.058-1.955-.27-2.413-.448a4.03 4.03 0 0 1-1.495-.972 4.03 4.03 0 0 1-.972-1.495c-.178-.458-.39-1.146-.448-2.413-.062-1.37-.075-1.78-.075-5.254s.013-3.884.075-5.254c.058-1.267.27-1.955.448-2.413.236-.607.518-1.04.972-1.495a4.03 4.03 0 0 1 1.495-.972c.458-.178 1.146-.39 2.413-.448 1.37-.062 1.78-.075 5.25-.075Zm0 3.986a6.671 6.671 0 1 0 0 13.342 6.671 6.671 0 0 0 0-13.342Zm0 11a4.329 4.329 0 1 1 0-8.658 4.329 4.329 0 0 1 0 8.658Zm8.496-11.264a1.559 1.559 0 1 1-3.118 0 1.559 1.559 0 0 1 3.118 0Z",
  },
  {
    name: "TikTok",
    handle: "@" + TIKTOK_USERNAME,
    href: TIKTOK_URL,
    path: "M23.4 3h-4.24v16.63a3.1 3.1 0 0 1-3.1 3.06 3.1 3.1 0 0 1-3.1-3.06 3.1 3.1 0 0 1 3.02-3.06v-4.3c-4.06.08-7.32 3.39-7.32 7.36 0 4.02 3.34 7.37 7.44 7.37 4.1 0 7.44-3.35 7.44-7.37v-8.5a9.1 9.1 0 0 0 5.3 1.7V8.53c-3.02 0-5.44-2.43-5.44-5.53Z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-text">
            Lovamoment<span className="text-primary">.id</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Website hadiah digital personal, pilih template, kirim ke doi.
          </p>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Jelajahi
            </span>
            <Link href="/gallery" className="text-text-muted hover:text-text">
              Gallery
            </Link>
            <Link href="/faq" className="text-text-muted hover:text-text">
              FAQ
            </Link>
            <Link href="/contact" className="text-text-muted hover:text-text">
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Terhubung
            </span>
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                /* py-1.5 lifts the tap target to 48px; the icon alone is only 36 */
                className="group flex items-center gap-3 py-1.5 text-text-muted transition-colors hover:text-text"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/15 transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
                  <svg viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-medium text-text">{s.name}</span>
                  <span className="text-xs">{s.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 px-5 py-5 text-center text-xs text-text-muted sm:px-8">
        © {new Date().getFullYear()} Lovamoment.id. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
}
