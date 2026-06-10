import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { categories } from "@/lib/shop-data";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Peshawar Traders" },
      { name: "description", content: "Browse our complete catalog of tactical and outdoor gear." },
    ],
  }),
  component: ShopPage,
});

export function ShopPage() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="max-w-2xl mb-14">
              <span className="eyebrow">Our Catalog</span>
              <h1 className="mt-4 font-display text-4xl md:text-6xl font-medium leading-[1.05]">
                Shop by <span className="italic text-primary">category</span>.
              </h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-lg">
                From precision airguns to field-maintenance tools — every category built for
                performance.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link
                    to="/shop/$category"
                    params={{ category: cat.slug }}
                    className="group block relative overflow-hidden rounded-md bg-charcoal min-h-[320px]"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
                            {cat.count} Products
                          </div>
                          <h3 className="text-white font-display text-2xl md:text-3xl font-medium">
                            {cat.name}
                          </h3>
                          <p className="text-white/60 text-sm mt-2 max-w-xs">{cat.description}</p>
                        </div>
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/0 border border-white/40 text-white transition-all duration-300 group-hover:bg-white group-hover:text-charcoal group-hover:rotate-45">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
