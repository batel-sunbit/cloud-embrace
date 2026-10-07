import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CartItem, useCart } from "@/lib/cart";
import {
  getNextOrderNumber,
  getStoredOrders,
  PAYMENT_BUSINESS_NUMBERS,
  saveOrder,
  updateOrderStatus,
  type OrderRecord,
  type PaymentMethod,
  type PaymentStatus,
  type FulfillmentStatus,
} from "@/lib/order-storage";
import { openWhatsAppOrder } from "@/lib/whatsapp";

const PAYMENT_OPTIONS: Array<{ id: PaymentMethod; label: string; description: string }> = [
  { id: "bit", label: "Bit", description: "Transfer to business number: 050-1234567" },
  { id: "paybox", label: "PayBox", description: "Transfer to business number: +972-50-1234567" },
];

const paymentStatusOptions: PaymentStatus[] = ["pending", "paid"];
const fulfillmentStatusOptions: FulfillmentStatus[] = ["processing", "shipped"];

const broadcastOrderUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("orders:updated"));
  }
};

export type OrderWorkflowMode = "checkout" | "admin";

type OrderWorkflowProps = {
  mode?: OrderWorkflowMode;
};

export function OrderWorkflow({ mode = "checkout" }: OrderWorkflowProps) {
  const { items, clear } = useCart();

  const isCheckout = mode === "checkout";

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentStatus>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<"all" | FulfillmentStatus>("all");
  const [printOrder, setPrintOrder] = useState<OrderRecord | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const refreshOrders = () => setOrders(getStoredOrders());

  useEffect(() => {
    refreshOrders();

    const onStorage = () => refreshOrders();
    const onCustom = () => refreshOrders();

    window.addEventListener("storage", onStorage);
    window.addEventListener("orders:updated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("orders:updated", onCustom);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !needle ||
        order.customerName.toLowerCase().includes(needle) ||
        order.phone.toLowerCase().includes(needle) ||
        order.address.toLowerCase().includes(needle) ||
        order.orderNumber.toLowerCase().includes(needle);

      const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
      const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillmentStatus === fulfillmentFilter;

      return matchesSearch && matchesPayment && matchesFulfillment;
    });
  }, [orders, search, paymentFilter, fulfillmentFilter]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill in your name, phone, and shipping address.");
      return;
    }

    setIsSubmitting(true);

    const order: OrderRecord = {
      id: `${Date.now()}`,
      orderNumber: getNextOrderNumber(),
      createdAt: new Date().toISOString(),
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      paymentMethod,
      paymentStatus: "pending",
      fulfillmentStatus: "processing",
      items: items.map((item) => ({
        slug: item.slug,
        name: item.name,
        price: item.price,
        qty: item.qty,
        greeting: item.greeting || "",
      })),
      total: subtotal,
    };

    saveOrder(order);
    broadcastOrderUpdate();
    clear();

    toast.success("Order saved. WhatsApp is opening with your order details.");
    openWhatsAppOrder(order);

    setForm({ customerName: "", phone: "", address: "", notes: "" });
    setIsSubmitting(false);
  };

  const updatePayment = (orderId: string, status: PaymentStatus) => {
    updateOrderStatus(orderId, { paymentStatus: status });
    refreshOrders();
    broadcastOrderUpdate();
  };

  const updateFulfillment = (orderId: string, status: FulfillmentStatus) => {
    updateOrderStatus(orderId, { fulfillmentStatus: status });
    refreshOrders();
    broadcastOrderUpdate();
  };

  const printFulfillmentSheet = (order: OrderRecord) => {
    setPrintOrder(order);
    setTimeout(() => window.print(), 120);
  };

  const renderCheckout = () => {
    if (!items.length) {
      return (
        <section className="mx-auto max-w-3xl rounded-[28px] border border-stone-200 bg-stone-50 p-10 text-center shadow-[0_18px_50px_rgba(120,98,74,0.07)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-6 font-serif text-4xl text-stone-900">Your cart is empty</h2>
          <p className="mt-3 text-stone-600">Add a poetry book before checking out.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Back to the shop</Link>
          </Button>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-6xl rounded-[28px] border border-stone-200 bg-white p-4 shadow-[0_18px_50px_rgba(120,98,74,0.08)] md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Three Knocks of Light</p>
            <h1 className="mt-2 font-serif text-4xl text-stone-900">Checkout</h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 md:flex">
            <Sparkles className="h-3.5 w-3.5" />
            Local order tracking
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-[24px] border border-stone-200 bg-stone-50 p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customerName" className="text-sm font-medium text-stone-700">
                  Full Name
                </Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleChange("customerName", event.target.value)
                  }
                  placeholder="Your full name"
                  className="h-11 rounded-xl border-stone-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-medium text-stone-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  dir="ltr"
                  value={form.phone}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleChange("phone", event.target.value)
                  }
                  placeholder="050-1234567"
                  className="h-11 rounded-xl border-stone-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-stone-700">
                  Full Shipping Address
                </Label>
                <Textarea
                  id="address"
                  rows={4}
                  value={form.address}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange("address", event.target.value)
                  }
                  placeholder="Street, number, building, city, postal code"
                  className="rounded-xl border-stone-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-sm font-medium text-stone-700">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange("notes", event.target.value)
                  }
                  placeholder="Delivery instructions or gift message"
                  className="rounded-xl border-stone-300 bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-900">Payment Method</h2>

              <div className="grid gap-3 md:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => {
                  const active = paymentMethod === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id)}
                      className={[
                        "rounded-2xl border p-4 text-left transition-all",
                        active
                          ? "border-amber-500 bg-amber-50 shadow-sm"
                          : "border-stone-200 bg-white hover:border-stone-300",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-lg font-semibold text-stone-900">{option.label}</span>
                        <span
                          className={[
                            "h-4 w-4 rounded-full border-2",
                            active ? "border-amber-600 bg-amber-600" : "border-stone-400 bg-transparent",
                          ].join(" ")}
                        />
                      </div>
                      <p className="mt-2 text-sm text-stone-600">{option.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-stone-700">
                <p className="font-medium text-amber-900">Transfer instructions:</p>
                <p className="mt-1">
                  {paymentMethod === "bit"
                    ? `Please transfer the full amount to the Bit business number ${PAYMENT_BUSINESS_NUMBERS.bit}. Include your name or order number in the transfer note.`
                    : `Please transfer the full amount to the PayBox number ${PAYMENT_BUSINESS_NUMBERS.paybox}. Include your full name and order number in the payment note.`}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-5 rounded-[24px] border border-stone-200 bg-stone-100/70 p-5 md:p-6">
            <h2 className="font-serif text-2xl text-stone-900">Order Summary</h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.slug}-${item.name}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-stone-900">{item.name}</p>
                    <p className="text-stone-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-medium text-stone-800">{item.price * item.qty} NIS</p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 text-sm text-stone-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{subtotal} NIS</span>
              </div>

              <div className="mt-3 flex items-center justify-between font-serif text-2xl text-stone-900">
                <span>Total</span>
                <span>{subtotal} NIS</span>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full bg-stone-900 text-white hover:bg-stone-700" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Confirm and Place Order"}
            </Button>
          </aside>
        </form>
      </section>
    );
  };

  const renderAdmin = () => (
    <section className="mx-auto max-w-7xl rounded-[28px] border border-stone-200 bg-white p-4 shadow-[0_18px_50px_rgba(120,98,74,0.08)] md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Management</p>
          <h2 className="mt-2 font-serif text-4xl text-stone-900">Incoming Orders</h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600">
          <ClipboardList className="h-4 w-4 text-stone-700" />
          {orders.length} total
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1.4fr_0.65fr_0.65fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search by name, phone, address, or order ID"
            className="h-11 rounded-xl border-stone-300 bg-stone-50 pl-9"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as "all" | PaymentStatus)}
          className="h-11 rounded-xl border border-stone-300 bg-stone-50 px-3 text-sm text-stone-700 outline-none"
        >
          <option value="all">All payment states</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>

        <select
          value={fulfillmentFilter}
          onChange={(e) => setFulfillmentFilter(e.target.value as "all" | FulfillmentStatus)}
          className="h-11 rounded-xl border border-stone-300 bg-stone-50 px-3 text-sm text-stone-700 outline-none"
        >
          <option value="all">All fulfillment states</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50 p-12 text-center text-stone-500">
          No orders match your current filters.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-[24px] border border-stone-200 bg-stone-50 p-4 shadow-sm md:p-5"
            >
              <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                    Order #{order.orderNumber}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-stone-900">{order.customerName}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      order.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800",
                    ].join(" ")}
                  >
                    {order.paymentStatus === "paid" ? (
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <Clock3 className="mr-1 h-3.5 w-3.5" />
                    )}
                    {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </span>

                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      order.fulfillmentStatus === "shipped"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-violet-100 text-violet-800",
                    ].join(" ")}
                  >
                    {order.fulfillmentStatus === "shipped" ? (
                      <Truck className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <PackageCheck className="mr-1 h-3.5 w-3.5" />
                    )}
                    {order.fulfillmentStatus === "shipped" ? "Shipped" : "Processing"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3 text-sm text-stone-700">
                  <p>
                    <span className="font-medium text-stone-900">Phone:</span> {order.phone}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">Address:</span> {order.address}
                  </p>

                  {order.notes ? (
                    <p>
                      <span className="font-medium text-stone-900">Notes:</span> {order.notes}
                    </p>
                  ) : null}

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.slug}`} className="rounded-2xl border border-stone-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium text-stone-900">{item.name}</span>
                          <span className="text-stone-500">Qty: {item.qty}</span>
                        </div>

                        {item.greeting ? (
                          <p className="mt-2 text-xs text-stone-500">Greeting: {item.greeting}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-[20px] border border-stone-200 bg-white p-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-stone-800">Payment Status</p>
                    <div className="flex flex-wrap gap-2">
                      {paymentStatusOptions.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={order.paymentStatus === status ? "default" : "outline"}
                          className={
                            order.paymentStatus === status
                              ? status === "paid"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-amber-600 hover:bg-amber-700"
                              : ""
                          }
                          onClick={() => updatePayment(order.id, status)}
                        >
                          {status === "paid" ? "Paid" : "Pending"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-stone-800">Fulfillment Status</p>
                    <div className="flex flex-wrap gap-2">
                      {fulfillmentStatusOptions.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={order.fulfillmentStatus === status ? "default" : "outline"}
                          className={
                            order.fulfillmentStatus === status
                              ? status === "shipped"
                                ? "bg-sky-600 hover:bg-sky-700"
                                : "bg-violet-600 hover:bg-violet-700"
                              : ""
                          }
                          onClick={() => updateFulfillment(order.id, status)}
                        >
                          {status === "shipped" ? "Shipped" : "Processing"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Total</span>
                      <span className="font-semibold text-stone-900">{order.total} NIS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
                    <span className="inline-flex items-center gap-1">
                      <ArrowRight className="h-3.5 w-3.5" />
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => printFulfillmentSheet(order)}
                  >
                    Export / Print Fulfillment Sheet
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {printOrder && (
        <div className="print-area hidden print:block">
          <div className="mx-auto max-w-md border-2 border-stone-900 p-8 text-stone-900">
            <p className="text-xs uppercase tracking-[0.4em] text-stone-500">Three Knocks of Light</p>
            <h3 className="mt-4 font-serif text-3xl">Fulfillment Sheet</h3>
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Order:</span> #{printOrder.orderNumber}
              </p>
              <p>
                <span className="font-semibold">Customer:</span> {printOrder.customerName}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {printOrder.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {printOrder.address}
              </p>
              <p>
                <span className="font-semibold">Payment:</span> {printOrder.paymentStatus}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {printOrder.fulfillmentStatus}
              </p>
              <p>
                <span className="font-semibold">Total:</span> {printOrder.total} NIS
              </p>
            </div>
            <div className="mt-6 border-t border-stone-300 pt-4 text-xs text-stone-500">
              Printed on {new Date().toLocaleDateString("en-GB")}
            </div>
          </div>
        </div>
      )}
    </section>
  );

  return <>{isCheckout ? renderCheckout() : renderAdmin()}</>;
}
