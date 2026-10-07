export type PaymentMethod = "bit" | "paybox";
export type PaymentStatus = "pending" | "paid";
export type FulfillmentStatus = "processing" | "shipped";

export type OrderItemRecord = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  greeting: string;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItemRecord[];
  total: number;
};

const STORAGE_KEY = "three-knocks-orders";

export const PAYMENT_BUSINESS_NUMBERS = {
  bit: "050-1234567",
  paybox: "+972-50-1234567",
} as const;

export function getStoredOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord) {
  if (typeof window === "undefined") return;

  const existing = getStoredOrders();
  const next = [order, ...existing];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function updateOrderStatus(
  orderId: string,
  patch: Partial<Pick<OrderRecord, "paymentStatus" | "fulfillmentStatus">>,
) {
  if (typeof window === "undefined") return;

  const orders = getStoredOrders();
  const updated = orders.map((order) =>
    order.id === orderId ? { ...order, ...patch } : order,
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getNextOrderNumber() {
  const orders = getStoredOrders();
  return `TK-${String(orders.length + 1).padStart(4, "0")}`;
}
