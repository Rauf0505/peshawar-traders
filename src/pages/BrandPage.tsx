import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getBrandBySlug } from "@/lib/api/brands.server";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { ArrowRight, Star, Globe, MapPin } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "@/components/site/Reveal";
import { motion } from "framer-motion";

interface Props {
  slug: string;
}

export function BrandPage({ slug }: Props) {
  const navigate = useNavigate();
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrandBySlug({ data: { slug } }).then((b) => {
      if (!b) navigate({ to: "/brands" });
      setBrand(b);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background text-foreground overflow-x-hidden">
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground animate-pulse">Loading brand…</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!brand) return null;

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative min-h-[55vh] flex items-end bg-charcoal overflow-hidden">
          {brand.bannerImage ? (
            <>
              <img
                src={brand.bannerImage}
                alt={brand.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(var(--primary),0.15),transparent)]" />
          )}

          <div className="container-x relative z-10 pb-16 md:pb-24">
            <Reveal>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
                <Link to="/brands" className="hover:text-white transition">Brands</Link>
                <span>/</span>
                <span className="text-white/80">{brand.name}</span>
              </div>

              {/* Logo */}
              {brand.logo && (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-16 object-contain mb-6"
                />
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <MapPin className="h-4 w-4" />
                  {COUNTRY_CODE[brand.country] ? getFlagEmoji(COUNTRY_CODE[brand.country]) : "🌐"} {brand.country}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-medium text-white leading-[1.02] max-w-3xl">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="mt-5 text-white/65 text-base md:text-lg max-w-2xl leading-relaxed">
                  {brand.description}
                </p>
              )}

              {/* Explore All CTA */}
              <div className="mt-8">
                <Link
                  to="/products"
                  search={{ brand: slug }}
                  className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold tracking-wide uppercase rounded-md hover:bg-charcoal transition-all duration-300"
                >
                  Explore All {brand.name} Products
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Featured Products */}
        {brand.featuredProducts && brand.featuredProducts.length > 0 && (
          <section className="py-20 md:py-28 bg-secondary">
            <div className="container-x">
              <Reveal>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                  <div>
                    <span className="eyebrow">Top Picks</span>
                    <h2 className="mt-4 font-display text-4xl md:text-5xl font-medium leading-[1.05] max-w-xl">
                      Featured <span className="italic text-primary">{brand.name}</span> Products
                    </h2>
                  </div>
                  <Link
                    to="/products"
                    search={{ brand: slug }}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition"
                  >
                    View all products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {brand.featuredProducts.map((p: any) => (
                  <motion.div key={p.sku} variants={itemVariants}>
                    <Link to="/product/$id" params={{ id: p.sku }} className="group block">
                      <div className="relative aspect-square overflow-hidden bg-background rounded-md border border-border/40">
                        {p.images[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        {p.comparePrice && (
                          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-destructive text-destructive-foreground">
                            Sale {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}%
                          </span>
                        )}
                        {p.stockStatus === "On Demand" && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-purple-600 text-white">
                            On Demand
                          </span>
                        )}
                        {p.stockStatus === "Out of Stock" && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-red-600 text-white">
                            Out of Stock
                          </span>
                        )}
                        {p.stockStatus === "Low Stock" && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-accent text-accent-foreground">
                            Low Stock
                          </span>
                        )}
                      </div>
                      <div className="pt-3 sm:pt-4">
                        <div className="flex items-center gap-1 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < Math.round(p.rating ?? 0) ? "fill-accent text-accent" : "text-border"}`} />
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-1">{p.rating?.toFixed(1) ?? "0.0"}</span>
                        </div>
                        <h3 className="font-display text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition line-clamp-2">
                          {p.name}
                        </h3>
                        {p.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                            {p.description}
                          </p>
                        )}
<div className="mt-2 flex items-baseline gap-2 flex-wrap">
                           <span className="font-semibold text-sm sm:text-base">${p.price}</span>
                           {p.comparePrice && (
                             <>
                               <span className="text-xs text-muted-foreground line-through">${p.comparePrice}</span>
                               <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                                 {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}% OFF
                               </span>
                             </>
                           )}
                         </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </Stagger>

              {/* Explore All button */}
              <div className="mt-16 text-center">
                <Link
                  to="/products"
                  search={{ brand: slug }}
                  className="group inline-flex items-center gap-3 border border-border hover:border-primary text-foreground hover:text-primary px-8 py-4 text-sm font-semibold tracking-wide uppercase rounded-md transition-all duration-300"
                >
                  Explore All {brand.name} Products
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
