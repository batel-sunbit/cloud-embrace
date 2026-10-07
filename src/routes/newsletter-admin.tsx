import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getNewsletterSubscribers, unsubscribeFromNewsletter } from "@/lib/newsletter";
import { Mail, Trash2 } from "lucide-react";

export const Route = createFileRoute("/newsletter-admin")({
  head: () => ({
    meta: [
      { title: "ניוזלטר - אדמין · שלוש נקישות אור" },
    ],
  }),
  component: NewsletterAdmin,
});

function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const subs = getNewsletterSubscribers().filter((s) => s.isActive);
    setSubscribers(subs);
  }, []);

  const handleUnsubscribe = (email: string) => {
    const result = unsubscribeFromNewsletter(email);
    if (result.success) {
      setSubscribers(subscribers.filter((s) => s.email !== email));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-light text-primary">מנויי הניוזלטר</h1>
          <p className="text-lg text-muted-foreground">
            {subscribers.length} מנוי{subscribers.length !== 1 ? "ים" : ""} פעיל{subscribers.length !== 1 ? "ים" : ""}
          </p>
        </div>
      </div>

      {subscribers.length > 0 ? (
        <div className="space-y-3">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card p-6 transition hover:bg-secondary/30"
            >
              <div className="flex-1 space-y-1">
                <h3 className="font-serif text-lg text-primary">{subscriber.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${subscriber.email}`} className="text-muted-foreground hover:text-primary hover:underline">
                    {subscriber.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(subscriber.subscribedAt).toLocaleDateString("he-IL")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnsubscribe(subscriber.email)}
                  className="text-muted-foreground/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/50 bg-secondary/20 p-12 text-center">
          <p className="text-muted-foreground">אין עדיין מנויים לניוזלטר.</p>
          <p className="mt-2 text-xs text-muted-foreground">מנויים חדשים יופיעו כאן</p>
        </div>
      )}
    </div>
  );
}
