import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "כניסת מנהלת · שלוש נקישות אור" },
      { name: "description", content: "כניסה לניהול ההזמנות." },
      { property: "og:title", content: "כניסת מנהלת" },
      { property: "og:description", content: "כניסה לניהול ההזמנות." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    if (error) { toast.error(error.message); return; }
    if (mode === "up") { toast.success("נשלח מייל אימות"); return; }
    nav({ to: "/admin" });
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 px-6 py-24">
      <h1 className="text-center font-serif text-3xl text-primary">{mode === "in" ? "כניסה" : "הרשמה"}</h1>
      <Input type="email" dir="ltr" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" dir="ltr" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      <Button type="submit" className="w-full">{mode === "in" ? "כניסה" : "הרשמה"}</Button>
      <button type="button" className="w-full text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "אין חשבון? להרשמה" : "יש חשבון? לכניסה"}
      </button>
    </form>
  );
}
