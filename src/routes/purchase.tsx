import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/purchase")({
  head: () => ({
    meta: [
      { title: "רכישה באתרים · שלוש נקישות אור" },
      { name: "description", content: "קנו את ספר שלוש נקישות אור." },
      { property: "og:title", content: "רכישה באתרים" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Purchase,
});

const stores = [
  {
    name: "קתרזיס",
    url: "https://bookscatharsis.com/",
    description: "הוצאת קתרזיס - ההוצאה של הספר",
    icon: BookOpen,
  },
  {
    name: "עברית",
    url: "https://www.e-vrit.co.il/?utm_source=google&utm_medium=cpc&utm_content=798376072744_197506920630&utm_term=%D7%A2%D7%91%D7%A8%D7%99%D7%AA&matchtype=e&device=c&network=g&campaignid=23595214959&gad_source=1&gad_campaignid=23595214959&gbraid=0AAAAAC_Jrw542jSh97S6oE_vTEBBZpcfr&gclid=CjwKCAjw25fWBhAVEiwAMopNjqI9gnUHTRKEeNuidoNoEQMcWQJcqw_8Ru4-ZDJJrQZ0pVRDCoZYQRoClycQAvD_BwE",
    description: "חנות ספרים עברית",
    icon: ShoppingCart,
  },
];

function Purchase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-20 text-center">
          <Branch className="mx-auto h-10 w-48 text-primary/60" />
          <h1 className="mt-6 font-serif text-5xl leading-tight text-primary md:text-6xl">רכישה באתרים</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            ספר "שלוש נקישות אור" זמין לרכישה בחנויות הספרים המובילות בישראל
          </p>
        </section>

        <section className="mb-20">
          <div className="grid gap-8 md:grid-cols-2">
            {stores.map((store) => {
              const Icon = store.icon;
              return (
                <a
                  key={store.name}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 transition hover:-translate-y-2 hover:shadow-[var(--shadow-soft)] md:p-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="relative space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="inline-block rounded-2xl bg-primary/10 p-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-serif text-3xl text-primary">{store.name}</h3>
                      </div>
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground">{store.description}</p>
                    <Button asChild className="mt-6 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                      <a href={store.url} target="_blank" rel="noopener noreferrer">
                        לחנות →
                      </a>
                    </Button>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-border/50 bg-gradient-to-br from-secondary/40 to-secondary/20 p-10 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-primary">רוצים קנייה ישירה?</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                אם אתם מחפשים הזמנה אישית או עם הודעה מיוחדת, אתם מוזמנים ליצור איתנו קשר ישירות דרך וואטסאפ
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Button asChild size="lg" className="rounded-2xl bg-primary text-lg px-8 py-6 h-auto hover:bg-primary/90">
                <a href="https://wa.me/972523972662" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  <span>וואטסאפ</span>
                </a>
              </Button>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
}
