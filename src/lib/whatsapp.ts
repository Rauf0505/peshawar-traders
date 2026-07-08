const WHATSAPP_NUMBER = "923006018100";
const BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function getWhatsAppLink(product: { name: string; sku: string }): string {
  const text = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (SKU: ${product.sku}). Is this item available?`,
  );
  return `${BASE_URL}?text=${text}`;
}
