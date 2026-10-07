import type { OrderRecord } from "@/lib/order-storage";

export const BUSINESS_WHATSAPP_NUMBER = "972523972662";
export const BUSINESS_EMAIL = "carmonabatel@gmail.com";

export function buildBusinessWhatsAppMessage(order: OrderRecord) {
  const lines = [
    "🔔 הזמנה חדשה התקבלה!",
    "",
    `הזמנה #: ${order.orderNumber}`,
    `לקוח: ${order.customerName}`,
    `טלפון: ${order.phone}`,
    `כתובת: ${order.address}`,
    `שיטת תשלום: ${order.paymentMethod === "bit" ? "Bit" : "PayBox"}`,
    `סטטוס תשלום: ${order.paymentStatus === "pending" ? "ממתין" : "שולם"}`,
    "",
    "פריטים:",
    ...order.items.map((item) => `- ${item.name} x${item.qty} (₪${item.price})${item.greeting ? ` | הברכה: ${item.greeting}` : ""}`),
    "",
    `סה״כ: ₪${order.total}`,
    "",
    "נחזיר אليך כשנתחיל לעבוד על ההזמנה 💜",
  ];

  return lines.join("\n");
}

export function buildCustomerWhatsAppMessage(order: OrderRecord) {
  const lines = [
    "תודה על הזמנתך! 🤍",
    "",
    `הזמנה מספר: #${order.orderNumber}`,
    "",
    "הזמנת:",
    ...order.items.map((item) => `- ${item.name} x${item.qty}`),
    "",
    `סה״כ לתשלום: ₪${order.total}`,
    "",
    "אנחנו נתחיל לעבוד על ההזמנה שלך ברגע שנקבל אישור תשלום 😊",
    "בתור: בתאל ❤️",
  ];

  return lines.join("\n");
}

function buildEmailBody(order: OrderRecord): string {
  const lines = [
    "🔔 הזמנה חדשה התקבלה!",
    "",
    `הזמנה #: ${order.orderNumber}`,
    `לקוח: ${order.customerName}`,
    `טלפון: ${order.phone}`,
    `כתובת: ${order.address}`,
    `שיטת תשלום: ${order.paymentMethod === "bit" ? "Bit" : "PayBox"}`,
    `סטטוס תשלום: ${order.paymentStatus === "pending" ? "ממתין" : "שולם"}`,
    "",
    "פריטים:",
    ...order.items.map((item) => `- ${item.name} x${item.qty} (₪${item.price})${item.greeting ? ` | הברכה: ${item.greeting}` : ""}`),
    "",
    `סה״כ: ₪${order.total}`,
    "",
    "נחזיר אליך כשנתחיל לעבוד על ההזמנה 💜",
  ];

  return lines.join("\n");
}

export function sendOrderNotificationToOwner(order: OrderRecord) {
  if (typeof window === "undefined") return;

  // Send WhatsApp notification to business
  const businessMessage = encodeURIComponent(buildBusinessWhatsAppMessage(order));
  const businessUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${businessMessage}`;
  window.open(businessUrl, "_blank", "noopener,noreferrer");

  // Send email notification to business after a short delay
  setTimeout(() => {
    const emailSubject = encodeURIComponent(`הזמנה חדשה: ${order.orderNumber}`);
    const emailBody = encodeURIComponent(buildEmailBody(order));
    const mailtoLink = `mailto:${BUSINESS_EMAIL}?subject=${emailSubject}&body=${emailBody}`;
    window.open(mailtoLink);
  }, 800);
}

export function openWhatsAppOrder(order: OrderRecord) {
  if (typeof window === "undefined") return;

  // Send message to business
  const businessMessage = encodeURIComponent(buildBusinessWhatsAppMessage(order));
  const businessUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${businessMessage}`;
  window.open(businessUrl, "_blank", "noopener,noreferrer");

  // Send message to customer after a short delay
  setTimeout(() => {
    const customerPhone = order.phone.replace(/^0/, "972");
    const customerMessage = encodeURIComponent(buildCustomerWhatsAppMessage(order));
    const customerUrl = `https://wa.me/${customerPhone}?text=${customerMessage}`;
    window.open(customerUrl, "_blank", "noopener,noreferrer");
  }, 500);
}
