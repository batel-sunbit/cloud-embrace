import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CartItem, useCart } from "@/lib/cart";
import { getNextOrderNumber, PAYMENT_BUSINESS_NUMBERS, saveOrder, type OrderItemRecord, type PaymentMethod } from "@/lib/order-storage";
import { openWhatsAppOrder, sendOrderNotificationToOwner } from "@/lib/whatsapp";
import { sendOrderNotifications } from "@/lib/notifications.server";
import { subscribeToNewsletter } from "@/lib/newsletter";

type CheckoutFormProps = {
  items: CartItem[];
  onComplete?: () => void;
};

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: "bit",
    label: "Bit",
    description: "Transfer to business number: 0523972662",
  },
  {
    id: "paybox",
    label: "PayBox",
    description: "Transfer to business number: +972-50-1234567",
  },
];

export function CheckoutForm({ items, onComplete }: CheckoutFormProps) {
  const { clear } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!items.length) {
      toast.error("הסל שלך ריק.");
      return;
    }

    if (!form.customerName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("אנא מלאו את השם, הדוא״ל, הטלפון והכתובת.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("אנא הזינו דוא״ל תקין.");
      return;
    }

    setIsSubmitting(true);

    const orderItems: OrderItemRecord[] = items.map((item) => ({
      slug: item.slug,
      name: item.name,
      price: item.price,
      qty: item.qty,
      greeting: item.greeting || "",
    }));

    const order = {
      id: `${Date.now()}`,
      orderNumber: getNextOrderNumber(),
      createdAt: new Date().toISOString(),
      customerName: form.customerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      paymentMethod,
      paymentStatus: "pending" as const,
      fulfillmentStatus: "processing" as const,
      items: orderItems,
      total: subtotal,
    };

    saveOrder(order);
    clear();
    onComplete?.();

    toast.success("ההזמנה נשמרה. משלחים הודעות...");
    
    // Subscribe to newsletter if checked
    if (subscribeNewsletter) {
      const result = subscribeToNewsletter(form.email, form.customerName);
      if (result.success) {
        console.log("Newsletter subscription successful");
      }
    }
    
    // Send all notifications (WhatsApp and Email to both customer and owner)
    sendOrderNotifications(order).catch((error) => {
      console.error("Failed to send notifications:", error);
      toast.error("ההזמנה נשמרה אך שליחת ההודעות נכשלה");
    });
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-6">
      <div className="space-y-2 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Three Knocks of Light</p>
        <h1 className="font-serif text-4xl text-primary">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customerName">שם מלא</Label>
              <Input
                id="customerName"
                value={form.customerName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("customerName", event.target.value)}
                placeholder="שמך המלא"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">דוא״ל</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("email", event.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון</Label>
              <Input
                id="phone"
                dir="ltr"
                value={form.phone}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("phone", event.target.value)}
                placeholder="0523972662"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">כתובת משלוח מלאה</Label>
              <Textarea
                id="address"
                rows={4}
                value={form.address}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleChange("address", event.target.value)}
                placeholder="רחוב, מספר, עיר, קוד דואר"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleChange("notes", event.target.value)}
                placeholder="הוסף הערות למשלוח או העדפות הנדסה"
              />
            </div>

            <div className="space-y-2 md:col-span-2 flex items-center gap-3">
              <input
                id="newsletter"
                type="checkbox"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="h-4 w-4 rounded border-border cursor-pointer"
              />
              <Label htmlFor="newsletter" className="cursor-pointer text-sm font-normal">
                אני רוצה להיות מנוי לניוזלטר וקבל עדכונים והצעות מיוחדות
              </Label>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">שיטת תשלום</h2>
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
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-primary/50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-semibold">{option.label}</span>
                      <span
                        className={[
                          "h-4 w-4 rounded-full border-2",
                          active ? "border-primary bg-primary" : "border-muted-foreground bg-transparent",
                        ].join(" ")}
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-dashed border-primary/30 bg-secondary/50 p-4 text-sm leading-6 text-foreground">
              <p className="font-medium text-primary">Transfer instructions:</p>
              <p>
                {paymentMethod === "bit"
                  ? `Please transfer the full amount to the Bit business number ${PAYMENT_BUSINESS_NUMBERS.bit}. Include the order number or your name in the transfer note.`
                  : `Please transfer the full amount to the PayBox number ${PAYMENT_BUSINESS_NUMBERS.paybox}. Include your full name and order number in the payment message.`}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-primary">סיכום הזמנה</h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.slug}-${item.name}`} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.qty}</p>
                </div>
                <p>{item.price * item.qty} NIS</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span>סכום ביניים</span>
              <span>{subtotal} ₪</span>
            </div>
            <div className="mt-2 flex items-center justify-between font-serif text-xl text-primary">
              <span>סה״כ</span>
              <span>{subtotal} ₪</span>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting ? "משלחים הזמנה..." : "אשר והנח הזמנה"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
