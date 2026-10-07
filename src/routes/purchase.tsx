import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/purchase")({
  head: () => ({
    meta: [
      { title: "רכישה באתרים · שלוש נקישות אור" },
      { name: "description", content: "קנו את ספר שלוש נקישות אור מחנויות הספרים המובילות בישראל." },
      { property: "og:title", content: "רכישה באתרים" },
      { property: "og:description", content: "קנו את ספר שלוש נקישות אור מחנויות הספרים המובילות בישראל." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Purchase,
});

const stores = [
  {
    name: "קתרזיס",
    url: "https://bookscatharsis.com/",
    description: "הוצאת קתרזיס - ההוצאה של הספר",
  },
  {
    name: "עברית",
    url: "https://www.e-vrit.co.il/?utm_source=google&utm_medium=cpc&utm_content=798376072744_197506920630&utm_term=%D7%A2%D7%91%D7%A8%D7%99%D7%AA&matchtype=e&device=c&network=g&campaignid=23595214959&gad_source=1&gad_campaignid=23595214959&gbraid=0AAAAAC_Jrw542jSh97S6oE_vTEBBZpcfr&gclid=CjwKCAjw25fWBhAVEiwAMopNjqI9gnUHTRKEeNuidoNoEQMcWQJcqw_8Ru4-ZDJJrQZ0pVRDCoZYQRoClycQAvD_BwE",
    description: "חנות ספרים עברית",
  },
];

function Purchase() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="space-y-8 text-center">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">רכישה באתרים</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          ספר "שלוש נקישות אור" זמין לרכישה בחנויות הספרים המובילות בישראל. להזמנות אונליין בחרו את הקנייה המועדפת עליכם:
        </p>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
        {stores.map((store) => (
          <a
            key={store.name}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-serif text-xl text-primary">{store.name}</h3>
                <ExternalLink className="h-4 w-4 text-primary/60 transition group-hover:text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{store.description}</p>
              <div className="pt-2">
                <Button className="w-full" asChild>
                  <a href={store.url} target="_blank" rel="noopener noreferrer">
                    לחנות
                  </a>
                </Button>
              </div>
            </div>
          </a>
        ))}

        {/* Website Link */}
        <a
          href="/"
          className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-serif text-xl text-primary">אתר הספר</h3>
              <ExternalLink className="h-4 w-4 text-primary/60 transition group-hover:text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">בקרו באתר הספר להקדמה וידיעות נוספות</p>
            <div className="pt-2">
              <Button className="w-full" asChild>
                <a href="/">
                  לאתר
                </a>
              </Button>
            </div>
          </div>
        </a>
      </section>

      <section className="mt-16 rounded-2xl border border-border/50 bg-secondary/30 p-8 text-center">
        <h2 className="font-serif text-2xl text-primary">תמיד תוכלו לקנות ישירות</h2>
        <p className="mt-3 text-muted-foreground">
          אם אתם רוצים ליצור איתנו קשר ישיר לרכישה מותאמת אישית, אתם מוזמנים ליצור קשר דרך עמוד <span className="font-semibold">נשארים בקשר</span>.
        </p>
      </section>
    </div>
  );
}
