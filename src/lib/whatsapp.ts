import type { OrderRecord } from "@/lib/order-storage";

export const BUSINESS_WHATSAPP_NUMBER = "972500000000";

export function buildWhatsAppMessage(order: OrderRecord) {
  const lines = [
    "Hello Three Knocks of Light 👋",
    "",
    "New order request",
    `Order #: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Payment method: ${order.paymentMethod.toUpperCase()}`,
    `Payment status: ${order.paymentStatus}`,
    `Fulfillment status: ${order.fulfillmentStatus}`,
    `Notes: ${order.notes || "None"}`,
    "",
    "Items:",
    ...order.items.map((item) => `- ${item.name} x${item.qty} (${item.price} each)${item.greeting ? ` | Greeting: ${item.greeting}` : ""}`),
    "",
    `Total: ${order.total} NIS`,
  ];

  return lines.join("\n");
}

export function openWhatsAppOrder(order: OrderRecord) {
  if (typeof window === "undefined") return;

  const message = encodeURIComponent(buildWhatsAppMessage(order));
  const url = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
