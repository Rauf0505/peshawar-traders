import { motion } from "framer-motion";
import { Star, Eye, ShoppingBag } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "./Reveal";
import { Link } from "@tanstack/react-router";
import { products as allProducts } from "@/lib/shop-data";

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 bg-secondary">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="eyebrow">Featured Products</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] max-w-xl">
                Tested in the <span className="italic text-primary">field</span>.
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Weapons", "Optics", "Apparel", "Tools"].map((t, i) => (
                <button key={t} className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border transition ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary"}`}>{t}</button>
              ))}
            </div>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {allProducts.map((p) => (
            <Link key={p.sku} to="/product/$id" params={{ id: p.sku }} className="group block">
              <motion.div variants={itemVariants} className="relative">
                <div className="relative aspect-square overflow-hidden bg-background rounded-md">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110" />
                  {p.comparePrice && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-md bg-destructive text-destructive-foreground">Sale</span>
                  )}
                  <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex gap-2">
                    <button className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-charcoal transition">
                      <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                    </button>
                    <button className="grid place-items-center w-11 bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition" aria-label="Quick view">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="pt-5">
<div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(p.rating ?? 0) ? "fill-accent text-accent" : "text-border"}`} />
                      ))}
                      <span className="text-[11px] text-muted-foreground ml-1">{p.rating ? p.rating.toFixed(1) : "0.0"}</span>
                    </div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.subcategory}</div>
                  <h3 className="mt-1 font-display text-lg font-medium text-foreground group-hover:text-primary transition">{p.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-foreground font-semibold">${p.price}</span>
                    {p.comparePrice && <span className="text-sm text-muted-foreground line-through">${p.comparePrice}</span>}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

