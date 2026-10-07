import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(5).max(300),
  bit_reference: z.string().trim().min(3).max(60),
  items: z.array(z.object({ slug: z.string().max(50), qty: z.number().int().min(1).max(20), greeting: z.string().max(500).default("") })).min(1).max(10),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: products, error } = await supabaseAdmin.from("products").select("slug,name,price,allows_greeting");
    if (error) throw new Error("שגיאה בטעינת מוצרים");
    const items = data.items.map((i) => {
      const p = products.find((x) => x.slug === i.slug);
      if (!p) throw new Error("מוצר לא קיים");
      return { slug: p.slug, name: p.name, price: p.price, qty: i.qty, greeting: p.allows_greeting ? i.greeting : "" };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = 20;
    const { data: order, error: e2 } = await supabaseAdmin
      .from("orders")
      .insert({ full_name: data.full_name, phone: data.phone, email: data.email, address: data.address, bit_reference: data.bit_reference, items, subtotal, shipping, total: subtotal + shipping })
      .select("order_number")
      .single();
    if (e2) throw new Error("לא הצלחנו לשמור את ההזמנה");
    return { orderNumber: order.order_number };
  });
