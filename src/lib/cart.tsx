import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { slug: string; name: string; price: number; qty: number; image: string; allowsGreeting: boolean; greeting: string };

type Ctx = {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (i: Omit<CartItem, "qty" | "greeting">) => void;
  setQty: (slug: string, qty: number) => void;
  setGreeting: (slug: string, g: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem("cart", JSON.stringify(items)); }, [items, loaded]);

  const add: Ctx["add"] = (i) => {
    setItems((prev) => {
      const ex = prev.find((p) => p.slug === i.slug);
      if (ex) return prev.map((p) => (p.slug === i.slug ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...i, qty: 1, greeting: "" }];
    });
    setOpen(true);
  };
  const setQty = (slug: string, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((p) => p.slug !== slug) : prev.map((p) => (p.slug === slug ? { ...p, qty } : p))));
  const setGreeting = (slug: string, greeting: string) => setItems((prev) => prev.map((p) => (p.slug === slug ? { ...p, greeting } : p)));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, open, setOpen, add, setQty, setGreeting, clear: () => setItems([]), subtotal, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
