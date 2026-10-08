import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, img, productImageKeys, MOCKUP_NOTICE } from "@/lib/shop";
import { Branch } from "@/components/Branch";
import bookAsset from "@/assets/book-cover.jpeg.asset.json";

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "שלוש נקישות אור · ספר השירה של בתאל כרמונה" },
        { name: "description", content: "ספר הביכורים של בתאל כרמונה ומארזי שירה לסבא/סבתא ולהורה – במחירי השקה." },
        { property: "og:title", content: "שלוש נקישות אור · בתאל כרמונה" },
        { property: "og:description", content: "ספר שירה ומארזי מתנה עדינים, במחירי השקה." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    }),
    loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
    errorComponent: () => <p className="p-12 text-center">לא הצלחנו לטעון את המוצרים.</p>,
    notFoundComponent: () => <p className="p-12 text-center">לא נמצא.</p>,
    component: Home,
  }
);

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  return (
    <div>
      {/* Hero Section - Main Focus */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 md:order-2 text-right">
            <div className="space-y-4">
              <Branch className="h-12 w-48 text-primary/50 ml-auto" />
              <h1 className="font-serif text-6xl md:text-7xl font-light leading-tight text-primary">
                שלוש נקישות אור
              </h1>
              <p className="text-lg font-light text-muted-foreground">
                ספר ביכורים של בתאל כרמונה
              </p>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground max-w-lg">
              הן מגיעות כשאנחנו הכי פחות מצפים להן, לפעמַיִם מתוך חושך, לפעמַיִם בדמות יד קטנה שאוחזת בך, ולפעמַיִם ברגע שקט של זוגיות שנבנתה מחדש.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#shop" className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-primary-foreground font-medium transition hover:bg-primary/90 active:scale-95">
                לרכישה
              </a>
              <Link to="/about" className="inline-flex items-center justify-center rounded-xl border border-primary/20 px-8 py-4 text-primary font-medium transition hover:border-primary/40 hover:bg-primary/5">
                לקרוא שירים
              </Link>
            </div>
          </div>

          {/* Book Image */}
          <div className="md:order-1 flex items-center justify-center">
            <img 
              src={bookAsset.url} 
              alt="הספר שלוש נקישות אור" 
              width={768} 
              height={964} 
              className="max-h-[600px] w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="shop" className="border-t border-border/40 bg-secondary/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-light text-primary mb-3">מתנות של מילים</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto text-right">{MOCKUP_NOTICE}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {products.map((p) => (
              <Link 
                key={p.id} 
                to="/product/$slug" 
                params={{ slug: p.slug }} 
                className="group overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="aspect-square overflow-hidden bg-secondary/40">
                  <img 
                    src={img(productImageKeys(p)[0])} 
                    alt={p.allows_greeting ? `הדמיית ${p.name}` : p.name} 
                    loading="lazy" 
                    width={1536} 
                    height={1536} 
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="space-y-3 p-6">
                  <h3 className="font-serif text-lg font-light text-primary">
                    {p.name === "ספר בלבד" ? "ספר" : p.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.subtitle}</p>
                  {p.allows_greeting && <p className="text-xs text-muted-foreground/70">הדמיה להמחשה בלבד</p>}
                  <div className="flex items-baseline gap-3 pt-2">
                    <span className="font-serif text-xl font-light text-primary">₪{p.price}</span>
                    <span className="text-sm text-muted-foreground/60 line-through">₪{p.original_price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
