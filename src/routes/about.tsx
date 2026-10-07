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
      <section className="space-y-6 text-center">
        <Branch className="mx-auto h-10 w-48 text-primary/60" />
        <h1 className="font-serif text-5xl text-primary">בתאל כרמונה</h1>
        <img src={author.url} alt="בתאל כרמונה" width={768} height={1145} className="mx-auto w-full max-w-xs rounded-lg" />
        <p className="text-sm tracking-[0.3em] text-muted-foreground">מהנדסת תוכנה · משוררת</p>
        <p className="mx-auto max-w-2xl text-lg leading-loose">
          ביום אני כותבת קוד, ובלילה – שירים. בין שתי השפות האלה גיליתי שהן לא כל כך רחוקות: שתיהן מחפשות דיוק, שתיהן מנסות לומר הרבה במעט מילים, ושתיהן נולדות מתוך רצון לחבר.
          "שלוש נקישות אור" הוא ספר הביכורים שלי – מכתב אהבה למשפחה, לחסד הקטן של היומיום ולרגעים השקטים שבהם האור דופק על הדלת.
        </p>
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
