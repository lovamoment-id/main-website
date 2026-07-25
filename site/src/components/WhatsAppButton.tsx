import { waLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <a
      href={waLink("Halo Lovamoment.id, aku mau tanya-tanya soal template hadiahnya 😊")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.35.66 4.55 1.8 6.44L4 29l7.72-1.76a12.9 12.9 0 0 0 4.3.74C22.64 28 28 22.6 28 15.98 28 9.36 22.64 3 16.02 3Zm0 23.24c-1.5 0-2.94-.4-4.2-1.14l-.3-.18-4.58 1.04 1.08-4.46-.2-.32a10.14 10.14 0 0 1-1.6-5.44c0-5.62 4.58-10.2 10.2-10.2 5.62 0 10.2 4.58 10.2 10.2 0 5.62-4.58 10.5-10.6 10.5Zm5.6-7.64c-.3-.16-1.8-.9-2.08-1-.28-.1-.48-.16-.68.16-.2.3-.78 1-.96 1.2-.18.2-.36.24-.66.08-.3-.16-1.28-.48-2.44-1.52-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.14-.62.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.06-.38-.02-.54-.08-.16-.68-1.66-.94-2.26-.24-.6-.5-.5-.68-.5h-.58c-.2 0-.52.08-.8.38-.28.3-1.04 1-1.04 2.48s1.06 2.9 1.2 3.1c.14.2 2.1 3.24 5.1 4.54.72.3 1.28.5 1.72.64.72.22 1.38.2 1.9.12.58-.08 1.8-.72 2.06-1.42.26-.7.26-1.3.18-1.42-.08-.14-.28-.22-.58-.36Z" />
      </svg>
    </a>
  );
}
