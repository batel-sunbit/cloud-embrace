import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Button } from "@/components/ui/button";
import { Music, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/podcasts")({
  head: () => ({
    meta: [
      { title: "הפודקאסטים שלי · שלוש נקישות אור" },
      { name: "description", content: "האזינו לפודקאסט סיפורי הילדים 'אמא בתאל מספרת' וגם למוזיקה של בתאל כרמונה." },
      { property: "og:title", content: "הפודקאסטים שלי" },
      { property: "og:description", content: "האזינו לפודקאסט סיפורי הילדים 'אמא בתאל מספרת'." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Podcasts,
});

function Podcasts() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="space-y-8 text-center">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">הפודקאסטים שלי</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          האזינו לסיפורים, לשירים ולרגעים טובים.
        </p>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        {/* אמא בתאל מספרת Podcast */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 flex flex-col">
          <div className="flex items-start gap-4">
            <Music className="h-8 w-8 flex-shrink-0 text-primary/60 mt-1" />
            <div>
              <h2 className="font-serif text-2xl text-primary">אמא בתאל מספרת</h2>
              <p className="mt-2 text-muted-foreground text-sm">פודקאסט סיפורי ילדים עם סיפורים מקוריים, שירים ודברים טובים לליל וקרא לילדים.</p>
            </div>
          </div>

          <Button asChild className="w-full mt-auto">
            <a
              href="https://open.spotify.com/show/033GWXeMQDPB5Zr0qFIWQ0"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <span>האזן בספוטיפיי</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* גם המוזיקה שלי בספוטיפיי */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 flex flex-col">
          <div className="flex items-start gap-4">
            <Music className="h-8 w-8 flex-shrink-0 text-primary/60 mt-1" />
            <div>
              <h2 className="font-serif text-2xl text-primary">המוזיקה שלי</h2>
              <p className="mt-2 text-muted-foreground text-sm">אתם מוזמנים להאזין למוזיקה המקורית שלי בספוטיפיי. חיפשו את השם שלי ותוכלו למצוא את המלודיות השקטות.</p>
            </div>
          </div>

          <Button asChild className="w-full mt-auto">
            <a
              href="https://open.spotify.com/artist/1ykkxoZJpDAVyBhUHdFTiJ"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <span>האזן בספוטיפיי</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
