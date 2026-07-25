import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-text">
            Lovamoment<span className="text-primary">.id</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Website hadiah digital personal, pilih template, kirim ke doi.
          </p>
        </div>

        <div className="flex gap-10 text-sm">
          <div className="flex flex-col gap-2">
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
        </div>
      </div>

      <div className="border-t border-primary/10 px-5 py-5 text-center text-xs text-text-muted sm:px-8">
        © {new Date().getFullYear()} Lovamoment.id. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
}
