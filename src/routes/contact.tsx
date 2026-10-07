import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "נשארים בקשר · שלוש נקישות אור" },
      { name: "description", content: "יצרו קשר עם בתאל כרמונה - דוא״ל או וואטסאפ." },
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
    value: "carmonabatel@gmail.com",
    href: "mailto:carmonabatel@gmail.com",
    action: "שלח דוא״ל",
  },
  {
    title: "WhatsApp",
    icon: MessageCircle,
    description: "שלחו הודעה בוואטסאפ",
    value: "0523972662",
    href: "https://wa.me/972523972662",
    action: "שלח בוואטסאפ",
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

      <section className="mt-16 grid gap-6 md:grid-cols-2">
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
                <a
                  href={method.href}
                  className="break-all text-primary hover:underline"
                  target={method.target}
                  rel={method.target === "_blank" ? "noopener noreferrer" : undefined}
                >
                  {method.value}
                </a>
              </div>

              <Button
                asChild
                className="w-full"
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
    </div>
  );
}
