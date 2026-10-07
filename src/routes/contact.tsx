import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Mail, MessageCircle } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";

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
    gradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200/20",
    iconColor: "text-blue-600/60",
    hoverColor: "hover:border-blue-300/40",
  },
  {
    title: "WhatsApp",
    icon: MessageCircle,
    description: "שלחו הודעה בוואטסאפ",
    value: "0523972662",
    href: "https://wa.me/972523972662?text=שלום%20בתאל%2C%20אני%20רוצה%20ליצור%20איתך%20קשר",
    action: "שלח בוואטסאפ",
    target: "_blank",
    gradient: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-200/20",
    iconColor: "text-green-600/60",
    hoverColor: "hover:border-green-300/40",
  },
];

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5" dir="rtl">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Header Section */}
        <section className="space-y-6 text-center mb-20">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-2xl"></div>
              <Branch className="relative h-12 w-56 text-primary/70" />
            </div>
          </div>
          
          <h1 className="font-serif text-6xl font-light text-primary leading-tight">
            נשארים בקשר
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground font-light">
            אני שמחה לשמוע מכם ולענות לכל שאלה. 
            <br />
            בחרו את הדרך הנוחה ביותר עבורכם ליצור קשר.
          </p>
        </section>

        {/* Contact Methods Grid */}
        <section className="grid gap-8 md:grid-cols-2">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const isWhatsApp = method.title === "WhatsApp";
            return (
              <div
                key={method.title}
                className={`group relative rounded-3xl border ${method.borderColor} bg-gradient-to-br ${method.gradient} backdrop-blur-sm p-8 space-y-6 flex flex-col transition-all duration-500 hover:shadow-xl ${method.hoverColor} overflow-hidden`}
              >
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-primary/5 to-transparent rounded-full -mr-20 -mt-20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${method.gradient} border ${method.borderColor}`}>
                      <Icon className={`h-6 w-6 ${method.iconColor}`} />
                    </div>
                    <h2 className="font-serif text-2xl font-light text-primary text-right flex-1">
                      {method.title}
                    </h2>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2">
                    <div className="flex items-center gap-3 flex-row-reverse">
                      <a
                        href={method.href}
                        target={method.target}
                        rel={method.target === "_blank" ? "noopener noreferrer" : undefined}
                        className="text-lg font-light text-primary/80 hover:text-primary break-all transition-colors duration-300 flex-1 hover:font-normal text-right"
                      >
                        {method.value}
                      </a>
                      {isWhatsApp && (
                        <a
                          href={method.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-shrink-0 ${method.iconColor} hover:text-green-600 transition-colors duration-300 opacity-60 group-hover:opacity-100`}
                          aria-label="פתח בוואטסאפ"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Newsletter Section */}
        <section className="mt-16 border-t border-border/40 pt-16">
          <NewsletterSignup variant="compact" />
        </section>

        {/* Footer Note */}
        <section className="mt-20 text-center">
          <p className="text-sm text-muted-foreground font-light">
            בדרך כלל אני משיבה בתוך 24 שעות 💌
          </p>
        </section>
      </div>
    </div>
  );
}
