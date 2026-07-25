// Placeholder business number — replace with the real WhatsApp Business number before launch.
export const WHATSAPP_NUMBER = "6281234567890";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
