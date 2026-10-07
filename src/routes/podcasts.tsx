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

const podcasts = [
  {
    title: "אמא בתאל מספרת",
    description: "פודקאסט סיפורי ילדים עם סיפורים מקוריים, שירים ודברים טובים לליל וקרא לילדים.",
    platforms: [
      { name: "Spotify", url: "https://open.spotify.com", platform: "spotify" },
      { name: "Apple Podcasts", url: "https://podcasts.apple.com", platform: "apple" },
      { name: "Google Podcasts", url: "https://podcasts.google.com", platform: "google" },
    ],
  },
];

function Podcasts() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="space-y-8 text-center">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">הפודקאסטים שלי</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          האזינו לסיפורים, לשירים ולרגעים טובים בנפח קטן.
        </p>
      </section>

      <section className="mt-16 space-y-12">
        {podcasts.map((podcast) => (
          <div key={podcast.title} className="rounded-2xl border border-border bg-card p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Music className="h-8 w-8 flex-shrink-0 text-primary/60" />
                <div>
                  <h2 className="font-serif text-2xl text-primary">{podcast.title}</h2>
                  <p className="mt-2 text-muted-foreground">{podcast.description}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-border/40 pt-6">
                <p className="text-sm font-semibold text-muted-foreground">האזינו בפלטפורמה המועדפת עליכם:</p>
                <div className="flex flex-wrap gap-3">
                  {podcast.platforms.map((platform) => (
                    <Button
                      key={platform.name}
                      asChild
                      variant="outline"
                      className="gap-2"
                    >
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform.name}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-border/50 bg-secondary/30 p-8 text-center">
        <h2 className="font-serif text-2xl text-primary">גם המוזיקה שלי בספוטיפיי</h2>
        <p className="mt-3 text-muted-foreground">
          אתם מוזמנים להאזין למוזיקה המקורית שלי בספוטיפיי. חיפשו את השם שלי ותוכלו למצוא את המלודיות השקטות.
        </p>
        <div className="mt-6">
          <Button asChild>
            <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
              האזן בספוטיפיי
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
