import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Music, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "נשארים בקשר · שלוש נקישות אור" },
      { name: "description", content: "יצרו קשר עם בתאל כרמונה - דוא״ל, טלפון וערוץ ספוטיפיי." },
      { property: "og:title", content: "נשארים בקשר" },
      { property: "og:description", content: "יצרו קשר עם בתאל כרמונה." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const contactMethods = [
  {
    title: "דוא״ל",
    icon: Mail,
    description: "שלחו הודעה ישירה",
    value: "contact@example.com",
    href: "mailto:contact@example.com",
    action: "שלח דוא״ל",
  },
  {
    title: "טלפון",
    icon: Phone,
    description: "התקשרו ישירות",
    value: "+972-XX-XXXX-XXX",
    href: "tel:+972",
    action: "התקשר",
    placeholder: true,
  },
  {
    title: "ספוטיפיי",
    icon: Music,
    description: "עקבו אחרי הפרופיל שלי",
    value: "בתאל כרמונה",
    href: "https://open.spotify.com/artist/",
    action: "בקרו בפרופיל",
    target: "_blank",
  },
];

function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="space-y-8 text-center">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">נשארים בקשר</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          אני שמחה לשמוע מכם. בחרו את הדרך הנוחה ביותר עבורכם ליצור קשר.
        </p>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.title}
              className="rounded-2xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary/60" />
                <h2 className="font-serif text-xl text-primary">{method.title}</h2>
              </div>

              <p className="text-sm text-muted-foreground">{method.description}</p>

              <div className="rounded-lg bg-secondary/40 p-3 text-sm">
                {method.placeholder ? (
                  <p className="text-muted-foreground italic">{method.value}</p>
                ) : (
                  <a
                    href={method.href}
                    className="break-all text-primary hover:underline"
                    target={method.target}
                  >
                    {method.value}
                  </a>
                )}
              </div>

              <Button
                asChild
                className="w-full"
                disabled={method.placeholder}
              >
                <a
                  href={method.href}
                  target={method.target}
                  rel={method.target === "_blank" ? "noopener noreferrer" : undefined}
                >
                  {method.action}
                </a>
              </Button>
            </div>
          );
        })}
      </section>

      <section className="mt-16 rounded-2xl border border-border/50 bg-secondary/30 p-8 space-y-4 text-center">
        <h2 className="font-serif text-2xl text-primary">תודה שנשארתם בקשר</h2>
        <p className="text-muted-foreground">
          כל הודעה, שאלה או משוב חשובים לי. אודה לכם על התעניינות בעבודה שלי ובסיפורים שלי.
        </p>
        <p className="text-muted-foreground text-sm">
          🤍
        </p>
      </section>
    </div>
  );
}
