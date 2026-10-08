import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import author from "@/assets/author.jpeg.asset.json";
import kindness from "@/assets/kindness-poem.jpeg.asset.json";
import yehonatan from "@/assets/yehonatan-poem.jpeg.asset.json";
import lego from "@/assets/lego-poem.jpeg.asset.json";
import millionaire from "@/assets/millionaire-poem.jpeg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "אודות בתאל כרמונה · שלוש נקישות אור" },
      { name: "description", content: "מהנדסת תוכנה ומשוררת. הכירו את בתאל כרמונה וקראו שירים מתוך שלוש נקישות אור." },
      { property: "og:title", content: "אודות בתאל כרמונה" },
      { property: "og:description", content: "מהנדסת תוכנה ומשוררת – ושירים מתוך הספר." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const poems = [
  { title: "אלגוריתם של חסד", image: kindness.url },
  { title: "יהונתן", image: yehonatan.url },
  { title: "לגו", image: lego.url },
  { title: "מיליונרית של הלב", image: millionaire.url },
];

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16" dir="rtl" style={{ textAlign: "right" }}>
      <header className="mb-16 space-y-8 text-center" dir="rtl">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">אודות</h1>
      </header>

      <Tabs defaultValue="book" className="w-full" dir="rtl">
        <TabsList className="mb-12 grid w-full grid-cols-2 flex-row-reverse" dir="rtl">
          <TabsTrigger value="book" className="text-base">על הספר</TabsTrigger>
          <TabsTrigger value="author" className="text-base">על בתאל</TabsTrigger>
        </TabsList>

        {/* Tab 1: About the Book */}
        <TabsContent value="book" className="space-y-12" dir="rtl">
          <article className="space-y-6 leading-relaxed text-right">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-primary">שלוש נקישות אור</h2>
              <p className="text-base text-muted-foreground">ספר ביכורים של בתאל כרמונה</p>
            </div>

            <div className="space-y-6 rounded-3xl bg-secondary/20 p-8">
              <p className="text-base leading-relaxed text-muted-foreground">
                "שלוש נקישות אור" הן יותר מאשר כותרת – הן עיקרון שניצב בלבם של הספר. הן מגיעות כשאנחנו הכי פחות מצפים להן, לפעמַיִם מתוך חושך עמוק, לפעמַיִם בדמות יד קטנה שאוחזת בך בלילה, ולפעמַיִם ברגע שקט של זוגיות שנבנתה מחדש מחרוזי אהבה ובחילה.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground">
                בשנים האחרונות, בתוך כל הטירוף של החיים – בנייה של קריירה, משפחה, גידול ילדים וטלטול הזהות – כתבתי את המילים האלה. שירים על אהבה שהשתנתה ולא נשארה אותה אהבה, על אימהות שהיא בבת אחת שטח הפקר של פלא וחרדה, על המפגש העדין שבין ילדות המתייתמת, הורות המשתגעת, והתבגרות שמצפצפת בדלת.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground">
                הספר פורסם בהוצאת קתרזיס, בעריכתם המדויקת והרגישה של יואב גלבוע ויקיר בן משה.
              </p>
            </div>
          </article>

          <section className="mt-16 space-y-12">
            <h3 className="font-serif text-3xl text-primary text-center">מתוך הספר</h3>
            <div className="space-y-20">
              {poems.map((p) => (
                <article key={p.title} className="mx-auto max-w-xl text-center">
                  <h4 className="sr-only">{p.title}</h4>
                  <img 
                    src={p.image} 
                    alt={`השיר ${p.title} מתוך שלוש נקישות אור מאת בתאל כרמונה`} 
                    loading="lazy" 
                    width={768} 
                    height={1145} 
                    className="w-full rounded-lg shadow-[var(--shadow-soft)]" 
                  />
                </article>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Tab 2: About Author */}
        <TabsContent value="author" className="space-y-12" dir="rtl">
          <AuthorContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuthorContent() {
  return (
    <>
      <article className="space-y-6 leading-relaxed text-right" dir="rtl">
        <p className="text-lg text-muted-foreground">נעים להכיר, אני בתאל.</p>
        <p className="text-base text-muted-foreground">
          אני מתגוררת בקריית טבעון יחד עם אור ושני הילדים שלנו. את המסע המקצועי שלי התחלתי בטכניון, שם סיימתי תואר ראשון במדעי המחשב בהצטיינות, ומאז אני עוסקת כמהנדסת תוכנה. אבל לצד הקוד והמערכות, הלב שלי תמיד פעם בעולמות של יצירה.
        </p>
        <p className="text-base text-muted-foreground">
          המקום הזה הוא הבית של כל מה שאני יוצרת – מרחב שבו מילים, צלילים וסיפורים נפגשים. אני כותבת שירים, סיפורים וספרי ילדים, ויוצרת מוזיקה. בין אם מדובר בשורות שמתגבשות לספר או במנגינות שיוצאות לאור, כל יצירה היא עוד נקישה קטנה של אור.
        </p>
        <p className="text-base text-muted-foreground">
          מוזמנים להאזין למוזיקה שלי בספוטיפיי, לצלול אל פודקאסט סיפורי הילדים <span className="font-semibold text-primary">אמא בתאל מספרת</span>, או ליצור איתי קשר דרך עמוד <span className="font-semibold text-primary">נשארים בקשר</span>. 🤍
        </p>
      </article>

      <section className="space-y-6 pt-8 text-center">
        <img 
          src={author.url} 
          alt="בתאל כרמונה" 
          width={768} 
          height={1145} 
          className="mx-auto w-full max-w-xs rounded-lg shadow-[var(--shadow-soft)]" 
        />
        <p className="text-sm tracking-[0.3em] text-muted-foreground">מהנדסת תוכנה · משוררת</p>
      </section>
    </>
  );
}