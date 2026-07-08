import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { ArrowUpRight, Globe, Search, X } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "@/components/site/Reveal";
import { motion } from "framer-motion";

interface Props {
  brands: any[];
}

export function BrandsPage({ brands }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return brands;
    const q = search.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q)),
    );
  }, [brands, search]);

  const byCountry = filtered.reduce<Record<string, any[]>>((acc, brand) => {
    const c = brand.country || "Other";
    if (!acc[c]) acc[c] = [];
    acc[c].push(brand);
    return acc;
  }, {});

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 md:py-36 bg-charcoal overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
          <div className="container-x relative z-10 text-center">
            <Reveal>
              <span className="eyebrow text-white/50">International Collection</span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-7xl font-medium text-white leading-[1.05] max-w-3xl mx-auto">
                World's Finest <span className="italic text-primary">Brands</span>
              </h1>
              <p className="mt-6 text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Premium airgun manufacturers from around the world — all in one place.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Search + Brands Grid */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container-x">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-16">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands by name, country, or description..."
                className="w-full pl-10 pr-10 py-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  {search ? `No brands matching "${search}"` : "No brands registered yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(byCountry).map(([country, countryBrands]) => (
                  <div key={country}>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-2xl">{COUNTRY_CODE[country] ? getFlagEmoji(COUNTRY_CODE[country]) : "🌐"}</span>
                      <h2 className="font-display text-2xl md:text-3xl font-medium">{country}</h2>
                      <span className="text-muted-foreground text-sm ml-1">({countryBrands.length})</span>
                    </div>
                    <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {countryBrands.map((brand) => (
                        <motion.div key={brand.id} variants={itemVariants}>
                          <Link
                            to="/brands/$slug"
                            params={{ slug: brand.slug }}
                            className="group block"
                          >
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border hover:border-primary transition-colors duration-300">
                              {brand.bannerImage ? (
                                <img
                                  src={brand.bannerImage}
                                  alt={brand.name}
                                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                <div className="flex justify-end">
                                  <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center text-white transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:rotate-45">
                                    <ArrowUpRight className="h-4 w-4" />
                                  </div>
                                </div>
                                <div>
                                  {brand.logo && (
                                    <img src={brand.logo} alt={`${brand.name} logo`} className="h-8 object-contain mb-3" />
                                  )}
                                  <h3 className="text-white font-display text-xl font-semibold leading-tight">{brand.name}</h3>
                                  <p className="text-white/60 text-xs mt-1">
                                    {COUNTRY_CODE[brand.country] ? getFlagEmoji(COUNTRY_CODE[brand.country]) : "🌐"} {brand.country} · {brand.productCount} products
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </Stagger>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
