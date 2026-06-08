import { motion } from "framer-motion";
import { Star, Eye, ShoppingBag } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "./Reveal";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

type P = { name: string; price: number; old?: number; rating: number; img: string; tag?: string; cat: string };
const products: P[] = [
  { name: "Apex Precision PCP Air Rifle", cat: "Airguns", price: 689, old: 749, rating: 4.9, img: p1, tag: "New" },
  { name: "Ridgeline MOLLE Tactical Vest", cat: "Vests", price: 189, rating: 4.8, img: p2 },
  { name: "Hunter's Reserve .22 Pellets", cat: "Pellets", price: 24, rating: 4.7, img: p3, tag: "Best Seller" },
  { name: "Summit 10x42 HD Binoculars", cat: "Optics", price: 459, old: 519, rating: 4.9, img: p4 },
  { name: "Blackwood Field Knife", cat: "Knives", price: 139, rating: 4.8, img: p5, tag: "New" },
  { name: "Trailhead 45L Hunting Pack", cat: "Gear", price: 219, rating: 4.7, img: p6 },
  { name: "Coyote Tactical Holster Pouch", cat: "Pouches", price: 59, rating: 4.6, img: p7 },
  { name: "Ironwood Leather Field Boots", cat: "Footwear", price: 289, old: 329, rating: 4.9, img: p8, tag: "Sale" },
];

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 bg-secondary">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="eyebrow">Featured Products</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] max-w-xl">
                Crafted with <span className="italic text-primary">purpose</span>.
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Airguns", "Tactical", "Optics", "Gear"].map((t, i) => (
                <button key={t} className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border transition ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary"}`}>{t}</button>
              ))}
            </div>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p) => (
            <motion.div key={p.name} variants={itemVariants} className="group">
              <div className="relative aspect-square overflow-hidden bg-background rounded-sm">
                <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110" />
                {p.tag && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold ${p.tag === "Sale" ? "bg-destructive text-destructive-foreground" : p.tag === "New" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                    {p.tag}
                  </span>
                )}
                <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-charcoal transition">
                    <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                  <button className="grid place-items-center w-11 bg-background hover:bg-accent hover:text-accent-foreground transition" aria-label="Quick view">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.round(p.rating) ? "fill-accent text-accent" : "text-border"}`} />
                  ))}
                  <span className="text-[11px] text-muted-foreground ml-1">{p.rating.toFixed(1)}</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.cat}</div>
                <h3 className="mt-1 font-display text-lg font-medium text-foreground group-hover:text-primary transition">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-foreground font-semibold">${p.price}</span>
                  {p.old && <span className="text-sm text-muted-foreground line-through">${p.old}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
