"use client";

import Link from "next/link";
import { Star, Eye, ShoppingBag, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { itemVariants } from "./Reveal";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface Props {
  product: any;
  index?: number;
}

export function ProductCard({ product: p, index }: Props) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.stockStatus === "On Demand" || p.stockStatus === "Out of Stock") return;
    addItem(p);
    toast.success(`${p.name} added to cart`);
  };

  return (
    <motion.div key={p.sku} variants={itemVariants}>
      <Link href={`/product/${p.sku}`} className="group block">
        <div className="relative">
          <div className="relative aspect-square overflow-hidden bg-background rounded-md">
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
              />
            )}
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
              {p.stockStatus === "On Demand" ? (
                <a
                  href={getWhatsAppLink(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white py-2 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold hover:bg-green-700 transition rounded"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> <span className="hidden xs:inline">WhatsApp</span>
                </a>
              ) : p.stockStatus !== "Out of Stock" ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 bg-primary text-primary-foreground py-2 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold hover:bg-charcoal transition rounded"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> <span className="hidden xs:inline">Add</span>
                </button>
              ) : null}
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
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.subcategoryName || p.subcategory || ""}</div>
            <h3 className="mt-1 font-display text-sm sm:text-base md:text-lg font-medium text-foreground group-hover:text-primary transition line-clamp-2">{p.name}</h3>
            <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-foreground font-semibold text-sm sm:text-base">Rs.{p.price}</span>
              {p.comparePrice && (
                <>
                  <span className="text-xs sm:text-sm text-muted-foreground line-through">Rs.{p.comparePrice}</span>
                  <span className="text-xs sm:text-sm font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                    {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
