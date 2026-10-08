import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/newsletter";

interface NewsletterSignupProps {
  variant?: "default" | "compact";
}

export function NewsletterSignup({ variant = "default" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !name.trim()) {
      toast.error("אנא מלאו את השם והדוא״ל.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("אנא הזינו דוא״ל תקין.");
      return;
    }

    setIsSubmitting(true);
    
    const result = subscribeToNewsletter(email.trim(), name.trim());
    
    if (result.success) {
      toast.success("✨ ברוכים הבאים לניוזלטר שלנו!");
      setEmail("");
      setName("");
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  const isCompact = variant === "compact";

  return (
    <section className={isCompact ? "mx-auto max-w-4xl px-6" : "mx-auto max-w-4xl px-6 py-20"}>
      <div className={`rounded-[32px] border border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-primary/[0.02] backdrop-blur-sm ${isCompact ? "p-8 md:p-12" : "p-12 md:p-16"} space-y-6 md:space-y-8`}>
        {!isCompact && (
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <h2 className="font-serif text-4xl font-light text-primary">נשארים בקשר</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              קבלו עדכונים על שחרורים חדשים, הצעות מיוחדות וסיפורים מהלב.
            </p>
          </div>
        )}

        {isCompact && (
          <div className="mx-auto max-w-2xl text-center mb-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              הירשמו לניוזלטר שלנו לקבלת עדכונים ודברים מיוחדים.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
          <Input
            placeholder="שמך"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur placeholder:text-muted-foreground/60"
           
          />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            dir="ltr"
            required
            disabled={isSubmitting}
            className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur placeholder:text-muted-foreground/60"
          />
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "מנויים..." : "הירשם לניוזלטר"}
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            אנו מכבדים את הפרטיות שלך. אתה יכול להתנתק בכל זמן.
          </p>
        </form>
      </div>
    </section>
  );
}
