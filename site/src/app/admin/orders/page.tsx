import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isSessionTokenValid } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { getTemplateBySlug, formatRupiah } from "@/lib/templates";
import { logout } from "@/app/admin/login/actions";
import PendingOrderCard from "./PendingOrderCard";
import PaidOrderCard from "./PaidOrderCard";

// Orders change constantly and this page is behind a login, so there is nothing
// to gain from caching it and a stale list would be actively misleading.
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // Checked again here, not only in proxy.ts, because this page renders
  // customer names and WhatsApp numbers.
  const cookieStore = await cookies();
  if (!isSessionTokenValid(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login?next=/admin/orders");
  }

  const orders = await listOrders();
  const pending = orders.filter((o) => o.status === "pending");
  const paid = orders.filter((o) => o.status === "paid");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">Pesanan</h1>
          <p className="mt-1 text-sm text-text-muted">
            {pending.length} menunggu, {paid.length} sudah aktif.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-primary/25 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-text transition-colors hover:border-primary/40"
          >
            Keluar
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-text">
          Menunggu pembayaran
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">Tidak ada pesanan menunggu.</p>
        ) : (
          <div className="mt-5 flex flex-col gap-5">
            {pending.map((order) => (
              <PendingOrderCard
                key={order.id}
                order={order}
                templateName={getTemplateBySlug(order.template_slug)?.name ?? order.template_slug}
                priceLabel={order.price_idr ? formatRupiah(order.price_idr) : "Tidak diisi"}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-text">Sudah aktif</h2>
        {paid.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">Belum ada pesanan yang diaktifkan.</p>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {paid.map((order) => (
              <PaidOrderCard
                key={order.id}
                order={order}
                templateName={getTemplateBySlug(order.template_slug)?.name ?? order.template_slug}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
