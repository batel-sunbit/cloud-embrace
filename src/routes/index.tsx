import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, img, productImageKeys, MOCKUP_NOTICE } from "@/lib/shop";
import { Branch } from "@/components/Branch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import bookAsset from "@/assets/book-cover.jpeg.asset.json";

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "שלוש נקישות אור · ספר השירה של בתאל כרמונה" },
        { name: "description", content: "ספר הביכורים של בתאל כרמונה ומארזי שירה לסבתא ולהורה – במחירי השקה." },
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
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <Branch className="h-10 w-40 text-primary/60" />
          <p className="text-sm tracking-[0.3em] text-muted-foreground">ספר ביכורים · בתאל כרמונה</p>
          <h1 className="font-serif text-5xl leading-tight text-primary md:text-6xl">שלוש נקישות אור</h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            שירים על אהבה, על משפחה, על חסד שקט שמסתתר בין שורות קוד. לפעמים צריך רק שלוש נקישות עדינות כדי שהלב ייפתח.
          </p>
          <div className="flex gap-3">
            <a href="#shop" className="rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90">למארזים ולספר</a>
            <Link to="/about" className="rounded-full border border-primary/30 px-6 py-3 text-primary transition hover:bg-secondary">לקרוא שירים</Link>
          </div>
        </div>
        <img src={bookAsset.url} alt="הספר שלוש נקישות אור מאת בתאל כרמונה" width={768} height={964} className="mx-auto max-h-[560px] w-full rounded-3xl object-contain shadow-[var(--shadow-soft)]" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 rounded-2xl border border-border/50 bg-secondary/30 p-8 text-center">
          <h2 className="font-serif text-3xl text-primary">על הספר</h2>
          <div className="mt-6 space-y-4 text-right leading-relaxed text-muted-foreground">
            <p>
              "שלוש נקישות אור".
            </p>
            <p>
              הן מגיעות כשאנחנו הכי פחות מצפים להן, לפעמַיִם מתוך חושך, לפעמַיִם בדמות יד קטנה שאוחזת בך, ולפעמַיִם ברגע שקט של זוגיות שנבנתה מחדש.
            </p>
            <p>
              בשנים האחרונות, בתוך כל הטירוף של החיים, בנייה של קריירה, משפחה, גידול ילדים והתפתחות אישית, כתבתי את המילים האלה. על אהבה שהשתנתה, על אימהות שהיא שטח הפקר של פלא וחרדה, ועל המפגש העדין שבין ילדות, הורות והתבגרות – על הרגעים שבהם הפגיעות פוגשת את העולם, ועל הדרך שבה האור מצליח למצוא סדקים ולהיכנס, במקומות הכי לא צפויים.
            </p>
            <p>
              אספתי את הרגעים האלה למילים, ועכשיו הם ארוזים בספר הבכורה שלי, "שלוש נקישות אור" (הוצאת קתרזיס, בעריכתם המדויקת והרגישה של יואב גלבוע ויקיר בן משה).
            </p>
            <p>
              מזמינה אתכם ללכת איתי אל תוך האור הזה.
            </p>
            <p className="font-serif text-lg text-primary">
              לב פתוח על המדפים. 🤍
            </p>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl text-primary">מתנות של מילים</h2>
          <p className="mt-2 text-muted-foreground">מחירי השקה לזמן מוגבל</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{MOCKUP_NOTICE}</p>
          <Alert className="mt-6">
            <AlertDescription className="text-sm text-muted-foreground">
              תמונות המארזים להמחשה בלבד. צבע הסימנייה והמסגרת עשויים להשתנות.
            </AlertDescription>
          </Alert>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="aspect-square overflow-hidden">
                <img src={img(productImageKeys(p)[0])} alt={p.allows_greeting ? `הדמיית ${p.name}` : p.name} loading="lazy" width={1536} height={1536} className="h-full w-full object-contain transition duration-700 group-hover:scale-105" />
              </div>
              <div className="space-y-2 p-6">
                <h3 className="font-serif text-2xl text-primary">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.subtitle}</p>
                {p.allows_greeting && <p className="text-xs text-muted-foreground">הדמיה להמחשה בלבד</p>}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="font-serif text-2xl text-primary">₪{p.price}</span>
                  <span className="text-muted-foreground line-through">₪{p.original_price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
