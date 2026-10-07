import { createFileRoute } from "@tanstack/react-router";
import { Branch } from "@/components/Branch";
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
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="space-y-8 text-center">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">אודות</h1>
        <div className="space-y-6 text-right leading-relaxed">
          <p className="text-lg text-muted-foreground">
            נעים להכיר, אני בתאל.
          </p>
          <p className="text-base text-muted-foreground">
            אני מתגוררת בקריית טבעון יחד עם אור ושני הילדים שלנו. את המסע המקצועי שלי התחלתי בטכניון, שם סיימתי תואר ראשון במדעי המחשב בהצטיינות, ומאז אני עוסקת כמהנדסת תוכנה. אבל לצד הקוד והמערכות, הלב שלי תמיד פעם בעולמות של יצירה.
          </p>
          <p className="text-base text-muted-foreground">
            המקום הזה הוא הבית של כל מה שאני יוצרת – מרחב שבו מילים, צלילים וסיפורים נפגשים. אני כותבת שירים, סיפורים וספרי ילדים, ויוצרת מוזיקה. בין אם מדובר בשורות שמתגבשות לספר או במנגינות שיוצאות לאור, כל יצירה היא עוד נקישה קטנה של אור.
          </p>
          <p className="text-base text-muted-foreground">
            ספר הבכורה שלי, <span className="font-semibold text-primary">"שלוש נקישות אור"</span> (הוצאת קתרזיס, בעריכתם המדויקת והרגישה של יואב גלבוע ויקיר בן משה), הוא אסופת שירים שנכתבה בתוך הטירוף של היום-יום – בין קריירה, משפחה, אימהות והרגעים שבהם הפגיעות פוגשת את העולם.
          </p>
          <p className="text-base text-muted-foreground">
            מוזמנים להאזין למוזיקה שלי בספוטיפיי, לצלול אל פודקאסט סיפורי הילדים <span className="font-semibold text-primary">"אמא בתאל מספרת"</span>, או ליצור איתי קשר דרך עמוד <span className="font-semibold text-primary">נשארים בקשר</span>. 🤍
          </p>
        </div>
      </section>

      <section className="mt-24 space-y-6 text-center">
        <img src={author.url} alt="בתאל כרמונה" width={768} height={1145} className="mx-auto w-full max-w-xs rounded-lg shadow-[var(--shadow-soft)]" />
        <p className="text-sm tracking-[0.3em] text-muted-foreground">מהנדסת תוכנה · משוררת</p>
      </section>

      <section className="mt-24 space-y-20">
        <h2 className="text-center font-serif text-3xl text-primary">מתוך הספר</h2>
        {poems.map((p, i) => (
          <article key={p.title} className={`mx-auto max-w-xl ${i % 2 ? "md:translate-x-8" : "md:-translate-x-8"}`}>
            <h3 className="sr-only">{p.title}</h3>
            <img src={p.image} alt={`השיר ${p.title} מתוך שלוש נקישות אור מאת בתאל כרמונה`} loading="lazy" width={768} height={1145} className="w-full rounded-lg shadow-[var(--shadow-soft)]" />
          </article>
        ))}
      </section>
    </div>
  );
}
