import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "ניהול הזמנות · שלוש נקישות אור" },
      { name: "description", content: "לוח ניהול הזמנות." },
      { property: "og:title", content: "ניהול הזמנות" },
      { property: "og:description", content: "לוח ניהול הזמנות." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Item = { name: string; qty: number; price: number; greeting: string };
const STATUS: Record<string, string> = { pending: "ממתין לטיפול", shipped: "נשלח", cancelled: "בוטל" };

function Admin() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [label, setLabel] = useState<any>(null);

  const isAdmin = useQuery({
    queryKey: ["isAdmin", user.id],
    queryFn: async () => (await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })).data === true,
  });
  const orders = useQuery({
    queryKey: ["orders"],
    enabled: isAdmin.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isAdmin.isLoading) return <p className="p-12 text-center">טוען...</p>;
  if (!isAdmin.data) return (
    <div className="p-12 text-center">
      <p>אין לחשבון זה הרשאת ניהול.</p>
      <Button variant="link" onClick={() => supabase.auth.signOut()}>התנתקות</Button>
    </div>
  );

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("עדכון נכשל"); return; }
    qc.invalidateQueries({ queryKey: ["orders"] });
  };
  const printLabel = (o: any) => { setLabel(o); setTimeout(() => window.print(), 100); };

  const list = (orders.data ?? []).filter((o) => !onlyOpen || o.status === "pending");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-primary">הזמנות</h1>
        <div className="flex gap-2">
          <Button variant={onlyOpen ? "default" : "outline"} onClick={() => setOnlyOpen(true)}>הזמנות שטרם הוצאו לשליחה</Button>
          <Button variant={!onlyOpen ? "default" : "outline"} onClick={() => setOnlyOpen(false)}>כל ההזמנות</Button>
          <Button variant="ghost" onClick={() => supabase.auth.signOut()}>התנתקות</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-right">
            <tr>{["#", "תאריך", "לקוח", "כתובת", "פריטים וברכות", "סה״כ", "אסמכתת ביט", "סטטוס", ""].map((h) => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="p-3">{o.order_number}</td>
                <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString("he-IL")}</td>
                <td className="p-3">{o.full_name}<br /><span dir="ltr" className="text-muted-foreground">{o.phone}</span><br /><span className="text-muted-foreground">{o.email}</span></td>
                <td className="p-3 max-w-48">{o.address}</td>
                <td className="p-3 max-w-64">
                  {(o.items as Item[]).map((i, k) => (
                    <div key={k} className="mb-1">{i.name} × {i.qty}{i.greeting && <p className="mt-1 rounded bg-muted p-2 text-xs italic">💌 {i.greeting}</p>}</div>
                  ))}
                </td>
                <td className="p-3">₪{o.total}</td>
                <td className="p-3" dir="ltr">{o.bit_reference}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="rounded border border-input bg-background p-1">
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="p-3">{o.status === "pending" && <Button size="sm" variant="outline" onClick={() => printLabel(o)}>מדבקת משלוח</Button>}</td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={9} className="p-10 text-center text-muted-foreground">אין הזמנות להצגה</td></tr>}
          </tbody>
        </table>
      </div>

      {label && (
        <div className="print-area hidden print:block">
          <div className="m-8 max-w-md border-2 border-foreground p-8 text-xl leading-relaxed">
            <p className="text-sm">דואר רשום · הזמנה #{label.order_number}</p>
            <p className="mt-4 text-2xl font-bold">{label.full_name}</p>
            <p className="whitespace-pre-line">{label.address}</p>
            <p dir="ltr" className="text-right">{label.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
}
