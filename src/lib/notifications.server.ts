import type { OrderRecord } from "@/lib/order-storage";

const BUSINESS_EMAIL = "carmonabatel@gmail.com";
const BUSINESS_WHATSAPP_NUMBER = "972523972662";

export async function sendOrderNotifications(order: OrderRecord) {
  try {
    // Send all notifications asynchronously without blocking
    Promise.all([
      sendCustomerWhatsApp(order),
      sendCustomerEmail(order),
      sendBusinessWhatsApp(order),
      sendBusinessEmail(order),
    ]).catch((error) => {
      console.error("Error sending notifications:", error);
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error in sendOrderNotifications:", error);
    return { success: false, error: String(error) };
  }
}

function buildOrderSummary(order: OrderRecord): string {
  const itemsList = order.items
    .map((item) => `- ${item.name} x${item.qty} (₪${item.price})${item.greeting ? ` | הברכה: ${item.greeting}` : ""}`)
    .join("\n");

  return `הזמנה #: ${order.orderNumber}
לקוח: ${order.customerName}
טלפון: ${order.phone}
כתובת: ${order.address}
שיטת תשלום: ${order.paymentMethod === "bit" ? "Bit" : "PayBox"}

פריטים:
${itemsList}

סה"כ: ₪${order.total}`;
}

async function sendCustomerWhatsApp(order: OrderRecord) {
  const message = `תודה על הזמנתך! 🤍

הזמנה מספר: #${order.orderNumber}

הזמנת:
${order.items.map((item) => `- ${item.name} x${item.qty}`).join("\n")}

סה"כ לתשלום: ₪${order.total}

אנחנו נתחיל לעבוד על ההזמנה שלך ברגע שנקבל אישור תשלום 😊
בתור: בתאל ❤️`;

  const customerPhone = order.phone.replace(/^0/, "972");
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
  
  console.log(`WhatsApp to customer: ${url}`);
}

async function sendBusinessWhatsApp(order: OrderRecord) {
  const message = `🔔 הזמנה חדשה התקבלה!

${buildOrderSummary(order)}

נחזיר אליך כשנתחיל לעבוד על ההזמנה 💜`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  console.log(`WhatsApp to business: ${url}`);
}

async function sendCustomerEmail(order: OrderRecord) {
  const itemsHtml = order.items.map((item) => `
    <div style="padding: 8px; border-bottom: 1px solid #ddd;">
      <strong>${item.name}</strong> x${item.qty} = ₪${item.price * item.qty}
      ${item.greeting ? `<br><em>הברכה: ${item.greeting}</em>` : ""}
    </div>
  `).join("");

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; color: #8B4513; font-size: 24px; margin-bottom: 20px; }
    .order-info { background-color: #f9f5f0; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .total { font-size: 18px; font-weight: bold; color: #8B4513; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">✨ תודה על הזמנתך! 🤍</div>
    <div class="order-info">
      <strong>הזמנה מספר:</strong> #${order.orderNumber}<br>
      <strong>תאריך:</strong> ${new Date(order.createdAt).toLocaleDateString("he-IL")}
    </div>
    <h3>הזמנת:</h3>
    <div>${itemsHtml}</div>
    <div class="total">סה"כ לתשלום: ₪${order.total}</div>
    <div style="margin-top: 20px; padding: 15px; background-color: #fff8f5; border-left: 4px solid #8B4513;">
      <strong>אנחנו נתחיל לעבוד על ההזמנה שלך ברגע שנקבל אישור תשלום! 😊</strong>
    </div>
  </div>
</body>
</html>`;

  console.log(`Email to customer (${order.email})`);
  // Here we would call the email service
}

async function sendBusinessEmail(order: OrderRecord) {
  const itemsHtml = order.items.map((item) => `
    <div style="padding: 8px; border-bottom: 1px solid #ddd;">
      <strong>${item.name}</strong> x${item.qty} = ₪${item.price * item.qty}
      ${item.greeting ? `<br><em>הברכה: "${item.greeting}"</em>` : ""}
    </div>
  `).join("");

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; color: #8B4513; font-size: 24px; margin-bottom: 20px; }
    .order-info { background-color: #f9f5f0; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .customer-details { background-color: #fff8f5; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .total { font-size: 18px; font-weight: bold; color: #8B4513; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🔔 הזמנה חדשה התקבלה!</div>
    <div class="order-info">
      <strong>הזמנה מספר:</strong> #${order.orderNumber}<br>
      <strong>תאריך:</strong> ${new Date(order.createdAt).toLocaleDateString("he-IL")}
    </div>
    <div class="customer-details">
      <h3>פרטי הלקוח:</h3>
      <p>
        <strong>שם:</strong> ${order.customerName}<br>
        <strong>דוא״ל:</strong> <a href="mailto:${order.email}">${order.email}</a><br>
        <strong>טלפון:</strong> <a href="tel:${order.phone}">${order.phone}</a><br>
        <strong>כתובת:</strong> ${order.address}
      </p>
    </div>
    <h3>פריטים:</h3>
    <div>${itemsHtml}</div>
    <div class="total">סה"כ: ₪${order.total}</div>
  </div>
</body>
</html>`;

  console.log(`Email to business (${BUSINESS_EMAIL})`);
  // Here we would call the email service
}
