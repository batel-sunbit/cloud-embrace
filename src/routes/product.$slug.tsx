import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { productsQuery, img, productImageKeys, MOCKUP_NOTICE } from "@/lib/shop";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const all = await context.queryClient.ensureQueryData(productsQuery);
    const p = all.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    const displayName = p.name === "ספר בלבד" ? "ספר" : p.name;
    return { name: displayName, subtitle: p.subtitle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} · שלוש נקישות אור` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:title", content: `${loaderData.name} · שלוש נקישות אור` },
          { property: "og:description", content: loaderData.subtitle },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "לא נמצא" }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: () => <p className="p-12 text-center">משהו השתבש.</p>,
  notFoundComponent: () => (
    <div className="p-12 text-center">המוצר לא נמצא. <Link to="/" className="text-primary underline">לחנות</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productsQuery);
  const p = data.find((x) => x.slug === slug);
  const [active, setActive] = useState(0);
  const { add } = useCart();
  if (!p) return <p className="p-12 text-center">המוצר לא נמצא.</p>;
  const imageKeys = productImageKeys(p);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2">
      <div className="space-y-4">
        <img src={img(imageKeys[active])} alt={active === 0 && p.allows_greeting ? `הדמיית ${p.name}` : p.name} width={1536} height={1536} className="aspect-square w-full rounded-3xl object-contain shadow-[var(--shadow-soft)]" />
        {p.allows_greeting && <p className="text-sm leading-relaxed text-muted-foreground">{MOCKUP_NOTICE}</p>}
        <div className="grid grid-cols-4 gap-3">
          {imageKeys.map((k, i) => (
            <Button key={k} variant="ghost" aria-label={`תמונה ${i + 1} של ${p.name}`} aria-pressed={i === active} onClick={() => setActive(i)} className={`h-auto overflow-hidden rounded-lg border-2 p-0 transition ${i === active ? "border-primary" : "border-transparent opacity-70"}`}>
              <img src={img(k)} alt="" loading="lazy" className="aspect-square w-full object-contain" />
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="font-serif text-4xl text-primary">{p.name === "ספר בלבד" ? "ספר" : p.name}</h1>
        <p className="text-lg italic text-muted-foreground">{p.subtitle}</p>
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl text-primary">₪{p.price}</span>
          <span className="text-lg text-muted-foreground line-through">₪{p.original_price}</span>
          <span className="rounded-full bg-accent px-3 py-1 text-xs">מחיר השקה</span>
        </div>
        <p className={`leading-relaxed text-muted-foreground ${p.slug === "book" ? "text-base font-sans" : "text-lg italic"}`}>{p.slug === "book" ? "ספר השירה הראשון של בתאל כרמונה. שירים על אהבה, משפחה וחסד – שלוש נקישות עדינות על דלת הלב." : p.description}</p>
        {p.slug !== "book" && (
          <div>
            <h2 className="mb-3 font-serif text-xl text-primary">במארז</h2>
            <ul className="space-y-2">
              {p.includes.map((i) => (
                <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{i}</li>
              ))}
            </ul>
          </div>
        )}
        {p.allows_greeting && <p className="rounded-lg bg-secondary p-3 text-sm">💌 אפשר להוסיף כרטיס ברכה אישי בסל או בעמוד התשלום.</p>}
        <Button size="lg" className="w-full rounded-full" onClick={() => add({ slug: p.slug, name: p.name, price: p.price, image: img(imageKeys[0]), allowsGreeting: p.allows_greeting })}>
          הוספה לסל
        </Button>
      </div>
    </div>
  );
}
