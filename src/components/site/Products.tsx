import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, ShoppingBag } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "./Reveal";
import { Link } from "@tanstack/react-router";
import { getHomePageProducts } from "@/lib/api/home-assignments.server";

const tabs = [
  { slug: "all", label: "All" },
  { slug: "weapons", label: "Weapons" },
  { slug: "optics", label: "Optics" },
  { slug: "apparel", label: "Apparel" },
  { slug: "tools", label: "Tools" },
];

export function Products() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getHomePageProducts({ data: { tabSlug: activeTab } }).then(setProducts);
  }, [activeTab]);

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
              {tabs.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setActiveTab(t.slug)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border transition ${activeTab === t.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((p) => (
            <Link key={p.sku} to="/product/$id" params={{ id: p.sku }} className="group block">
              <motion.div variants={itemVariants} className="relative">
                <div className="relative aspect-square overflow-hidden bg-background rounded-md">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110" />
                  {p.comparePrice && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-destructive text-destructive-foreground">
                      Sale {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}%
                    </span>
                  )}
                  {p.stockStatus === "On Demand" && (
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-purple-600 text-white">
                      On Demand
                    </span>
                  )}
                  {p.stockStatus === "Out of Stock" && (
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-red-600 text-white">
                      Out of Stock
                    </span>
                  )}
                  {p.stockStatus === "Low Stock" && (
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-accent text-accent-foreground">
                      Low Stock
                    </span>
                  )}
                  <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex gap-1.5 sm:gap-2">
                    <button className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 bg-primary text-primary-foreground py-2 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold hover:bg-charcoal transition rounded">
                      <ShoppingBag className="h-3.5 w-3.5" /> <span className="hidden xs:inline">Add</span>
                    </button>
                    <button className="grid place-items-center w-9 sm:w-11 bg-background rounded hover:bg-accent hover:text-accent-foreground transition" aria-label="Quick view">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="pt-3 sm:pt-5">
                  <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < Math.round(p.rating ?? 0) ? "fill-accent text-accent" : "text-border"}`} />
                    ))}
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground ml-1">{p.rating ? p.rating.toFixed(1) : "0.0"}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.subcategory}</div>
                  <h3 className="mt-1 font-display text-sm sm:text-base md:text-lg font-medium text-foreground group-hover:text-primary transition line-clamp-2">{p.name}</h3>
<div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-foreground font-semibold text-sm sm:text-base">${p.price}</span>
                      {p.comparePrice && (
                        <>
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            ${p.comparePrice}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                            {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}% OFF
                          </span>
                        </>
                      )}
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
