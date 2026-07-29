import LoginForm from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <h1 className="font-display text-2xl font-semibold text-text">Masuk Admin</h1>
      <p className="mt-2 text-sm text-text-muted">
        Halaman ini hanya untuk pengelola Lovamoment.id.
      </p>
      <LoginForm next={next ?? "/admin/orders"} />
    </div>
  );
}
