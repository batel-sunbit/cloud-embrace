import type { Tables } from "@/integrations/supabase/types";
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import bookAsset from "@/assets/book-cover.jpeg.asset.json";
import grandma from "@/assets/grandma-mockup-corrected.jpg";
import parent from "@/assets/parent-mockup-corrected.jpg";
import kindness from "@/assets/kindness-poem.jpeg.asset.json";
import lego from "@/assets/lego-poem.jpeg.asset.json";
import millionaire from "@/assets/millionaire-poem.jpeg.asset.json";
import yehonatan from "@/assets/yehonatan-poem.jpeg.asset.json";

const book = bookAsset.url;
export const IMAGES: Record<string, string> = { book, grandma, parent, framed: kindness.url, magnet: lego.url, kindness: kindness.url, lego: lego.url, millionaire: millionaire.url, yehonatan: yehonatan.url };
export const img = (k?: string) => (k && IMAGES[k]) || book;
export const MOCKUP_NOTICE = "תמונות המארזים הן הדמיה להמחשה בלבד. צבע האריזה וצבע הסימנייה עשויים להיות שונים מהתמונות.";
export const productImageKeys = (product: Product) => product.allows_greeting
  ? product.name.includes("סבתא") ? ["grandma", "book", "kindness", "lego"] : ["parent", "book", "millionaire", "yehonatan"]
  : ["book"];

export const SHIPPING = 20;
// TODO: replace with the author's real Bit number
export const BIT_PHONE = "050-0000000";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export type Product = Tables<"products">;
