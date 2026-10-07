import { Link } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { SHIPPING, MOCKUP_NOTICE } from "@/lib/shop";

export function SiteHeader() {
  const { count, open, setOpen, items, setQty, subtotal } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl tracking-wide text-primary">שלוש נקישות אור</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-primary" activeProps={{ className: "text-primary font-semibold" }} activeOptions={{ exact: true }}>החנות</Link>
          <Link to="/about" className="hover:text-primary" activeProps={{ className: "text-primary font-semibold" }}>אודות</Link>
          <Link to="/purchase" className="hover:text-primary" activeProps={{ className: "text-primary font-semibold" }}>רכישה באתרים</Link>
          <Link to="/podcasts" className="hover:text-primary" activeProps={{ className: "text-primary font-semibold" }}>הפודקאסטים שלי</Link>
          <Link to="/contact" className="hover:text-primary" activeProps={{ className: "text-primary font-semibold" }}>נשארים בקשר</Link>
          <button onClick={() => setOpen(true)} className="relative" aria-label="סל קניות">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{count}</span>}
          </button>
        </nav>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex w-full flex-col bg-background sm:max-w-md" dir="rtl">
          <SheetHeader><SheetTitle className="font-serif text-2xl text-primary">הסל שלך</SheetTitle></SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {items.length === 0 && <p className="py-12 text-center text-muted-foreground">הסל עדיין ריק, כמו דף לפני שיר.</p>}
            {items.map((i) => (
              <div key={i.slug} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                <img src={i.image} alt={i.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between"><span className="font-serif">{i.name}</span><button onClick={() => setQty(i.slug, 0)} aria-label="הסר"><X className="h-4 w-4 text-muted-foreground" /></button></div>
                  <div className="text-sm text-muted-foreground">₪{i.price}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => setQty(i.slug, i.qty - 1)} className="rounded border p-1"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.slug, i.qty + 1)} className="rounded border p-1"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {items.length > 0 && (
            <div className="space-y-2 border-t border-border p-4 text-sm">
              <div className="flex justify-between"><span>סכום ביניים</span><span>₪{subtotal}</span></div>
              <div className="flex justify-between"><span>משלוח בדואר רשום</span><span>₪{SHIPPING}</span></div>
              <div className="flex justify-between font-serif text-lg text-primary"><span>סה״כ</span><span>₪{subtotal + SHIPPING}</span></div>
              {items.some((i) => i.allowsGreeting) && <p className="text-xs leading-relaxed text-muted-foreground">{MOCKUP_NOTICE}</p>}
              <Button asChild className="mt-2 w-full" onClick={() => setOpen(false)}><Link to="/checkout">למעבר לתשלום</Link></Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/40 bg-secondary/20 py-16 text-center">
      <div className="mx-auto max-w-6xl px-6 space-y-8">
        <div className="space-y-2">
          <p className="font-serif text-lg text-primary">שלוש נקישות אור</p>
          <p className="text-sm text-muted-foreground">בתאל כרמונה</p>
        </div>
        
        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:justify-center md:gap-8">
          <span>משלוח בדואר רשום לכל הארץ</span>
          <span className="hidden md:inline">·</span>
          <span>תשלום בביט · פייבוקס</span>
          <span className="hidden md:inline">·</span>
          <span>WhatsApp: 0523972662</span>
        </div>

        <div className="border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} שלוש נקישות אור. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
