import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-32 text-center">
      <span className="font-display text-6xl font-semibold text-primary">404</span>
      <h1 className="font-display text-2xl font-semibold text-text">Halaman tidak ditemukan</h1>
      <p className="text-text-muted">Sepertinya link yang kamu tuju sudah pindah atau tidak ada.</p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
