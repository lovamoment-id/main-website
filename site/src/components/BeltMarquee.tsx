/**
 * Running keyword belt below the hero (design brief §3b).
 * Deliberately carries no customer counts or other unearned claims.
 */
const BELT_ITEMS = [
  "LOVAMOMENT.ID",
  "PROSES LINK CEPAT",
  "BEAUTIFUL MOMENT",
  "HARGA TERJANGKAU",
  "FULL CUSTOM",
  "DESAIN PREMIUM",
  "AKTIF SELAMANYA",
  "MURAH BUKAN MURAHAN",
];

function BeltRun({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      /* The duplicate exists only so the loop can wrap seamlessly. Hiding it
         keeps screen readers from announcing the list twice. */
      aria-hidden={hidden || undefined}
    >
      {BELT_ITEMS.map((item) => (
        <li
          key={item}
          className="flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-white"
        >
          {item}
          <span className="px-5 text-white/70" aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function BeltMarquee() {
  return (
    <div className="overflow-hidden bg-primary py-3.5">
      <div className="animate-belt flex w-max">
        <BeltRun />
        <BeltRun hidden />
      </div>
    </div>
  );
}
