import { useState, useEffect } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getProductsFiltered, getCountries } from "@/lib/api/brands.server";
import { getCategories } from "@/lib/api/products.server";
import { getBrands } from "@/lib/api/brands.server";
import { Search, Star, ShoppingBag, Eye, SlidersHorizontal, X, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppLink } from "@/lib/whatsapp";

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name: A–Z" },
];

interface Filters {
  category?: string;
  brand?: string;
  country?: string;
  subcategory?: string;
  q?: string;
  sort?: string;
}

export function ProductsPage() {
  const search = useSearch({ from: "/products" }) as Filters;
  const navigate = useNavigate({ from: "/products" });
  const { addItem } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const filters: Filters = {
    category: search.category,
    brand: search.brand,
    country: search.country,
    subcategory: search.subcategory,
    q: search.q,
    sort: search.sort,
  };

  const setFilter = (key: keyof Filters, value: string | undefined) => {
    navigate({ search: { ...filters, [key]: value || undefined } });
  };

  const clearAll = () => navigate({ search: {} });

  const activeFilterCount = [filters.category, filters.brand, filters.country, filters.subcategory, filters.q].filter(Boolean).length;

  useEffect(() => {
    Promise.all([getCategories(), getBrands(), getCountries()]).then(([cats, brs, cns]) => {
      setCategories(cats);
      setBrands(brs);
      setCountries(cns);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductsFiltered({
      data: {
        category: filters.category,
        brand: filters.brand,
        country: filters.country,
        subcategory: filters.subcategory,
        search: filters.q,
        sort: filters.sort,
      },
    }).then((p) => { setProducts(p); setLoading(false); });
  }, [filters.category, filters.brand, filters.country, filters.subcategory, filters.q, filters.sort]);

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="border-b border-border pb-5 mb-5 last:border-0 last:mb-0">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-sm font-semibold text-foreground mb-3"
        >
          {title}
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {open && children}
      </div>
    );
  };

  const FilterButton = ({
    label, active, onClick,
  }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${active ? "bg-primary text-primary-foreground font-medium" : "text-foreground/80 hover:bg-secondary hover:text-foreground"}`}
    >
      {label}
    </button>
  );

  const Sidebar = () => (
    <div className="space-y-0">
      <FilterSection title="Categories">
        <FilterButton label="All Categories" active={!filters.category} onClick={() => setFilter("category", undefined)} />
        {categories.map((c: any) => (
          <FilterButton
            key={c.id}
            label={c.name}
            active={filters.category === c.slug}
            onClick={() => setFilter("category", c.slug === filters.category ? undefined : c.slug)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Brands">
        <FilterButton label="All Brands" active={!filters.brand} onClick={() => setFilter("brand", undefined)} />
        {brands.map((b: any) => (
          <FilterButton
            key={b.id}
            label={`${b.name} (${b.country})`}
            active={filters.brand === b.slug}
            onClick={() => setFilter("brand", b.slug === filters.brand ? undefined : b.slug)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Country of Origin">
        <FilterButton label="All Countries" active={!filters.country} onClick={() => setFilter("country", undefined)} />
        {countries.map((c) => (
          <FilterButton
            key={c}
            label={`$${COUNTRY_CODE[c] ? getFlagEmoji(COUNTRY_CODE[c]) : "🌐"} ${c}`}
            active={filters.country === c}
            onClick={() => setFilter("country", c === filters.country ? undefined : c)}
          />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-20">
          <div className="container-x">
            {/* Page Header */}
            <div className="mb-8 md:mb-10">
              <span className="eyebrow">Tactical & Outdoor Gear</span>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.05]">
                {filters.brand
                  ? `${brands.find((b) => b.slug === filters.brand)?.name ?? filters.brand} Products`
                  : filters.category
                  ? `${categories.find((c: any) => c.slug === filters.category)?.name ?? filters.category}`
                  : "All Products"}
              </h1>
            </div>

            {/* Search + Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, SKU…"
                  value={filters.q ?? ""}
                  onChange={(e) => setFilter("q", e.target.value || undefined)}
                  className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                />
                {filters.q && (
                  <button
                    onClick={() => setFilter("q", undefined)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filters.sort ?? "default"}
                  onChange={(e) => setFilter("sort", e.target.value === "default" ? undefined : e.target.value)}
                  className="h-11 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 h-11 px-4 border border-border rounded-md text-sm hover:border-primary transition"
                >
                  Filters {activeFilterCount > 0 && <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center">{activeFilterCount}</span>}
                </button>
              </div>
            </div>

            {/* Active Filters chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {filters.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                    {categories.find((c: any) => c.slug === filters.category)?.name ?? filters.category}
                    <button onClick={() => setFilter("category", undefined)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                    {brands.find((b) => b.slug === filters.brand)?.name ?? filters.brand}
                    <button onClick={() => setFilter("brand", undefined)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.subcategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                    {filters.subcategory.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    <button onClick={() => setFilter("subcategory", undefined)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.country && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                    {COUNTRY_CODE[filters.country] ? getFlagEmoji(COUNTRY_CODE[filters.country]) : "🌐"} {filters.country}
                    <button onClick={() => setFilter("country", undefined)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground transition ml-1">
                  Clear all
                </button>
              </div>
            )}

            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-56 shrink-0">
                <Sidebar />
              </aside>

              {/* Mobile Sidebar Overlay */}
              <AnimatePresence>
                {showFilters && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                      onClick={() => setShowFilters(false)}
                    />
                    <motion.div
                      initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                      transition={{ type: "tween", duration: 0.3 }}
                      className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-background p-6 overflow-y-auto lg:hidden"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-semibold text-lg">Filters</span>
                        <button onClick={() => setShowFilters(false)} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary transition">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <Sidebar />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Products Grid */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-muted-foreground mb-5">
                  {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-square rounded-md bg-secondary animate-pulse" />
                        <div className="h-4 w-3/4 bg-secondary animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-secondary animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-24">
                    <Search className="h-10 w-10 mx-auto opacity-30 mb-3" />
                    <p className="font-medium">No products found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters.</p>
                    <button
                      onClick={clearAll}
                      className="mt-4 px-5 py-2.5 text-xs uppercase tracking-wider rounded-full bg-primary text-primary-foreground hover:bg-charcoal transition"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {products.map((p, i) => (
                      <motion.div
                        key={p.sku}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                      >
                        <Link to="/product/$id" params={{ id: p.sku }} className="group block">
                          <div className="relative aspect-square overflow-hidden bg-secondary rounded-md border border-border/40">
                            {p.images[0] && (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            )}
                            {p.comparePrice && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold rounded bg-destructive text-destructive-foreground">
                                Sale {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}%
                              </span>
                            )}
                            {p.stockStatus === "On Demand" && (
                              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold rounded bg-purple-600 text-white">
                                On Demand
                              </span>
                            )}
                            {p.stockStatus === "Out of Stock" && (
                              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold rounded bg-red-600 text-white">
                                Out of Stock
                              </span>
                            )}
                            {p.stockStatus === "Low Stock" && (
                              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold rounded bg-accent text-accent-foreground">
                                Low Stock
                              </span>
                            )}
                            <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-1.5">
                              {p.stockStatus === "On Demand" ? (
                                <a
                                  href={getWhatsAppLink(p)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 inline-flex items-center justify-center gap-1 bg-green-600 text-white py-2.5 text-[10px] sm:text-xs uppercase tracking-wider font-semibold rounded hover:bg-green-700 transition"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">WhatsApp</span>
                                </a>
                              ) : p.stockStatus !== "Out of Stock" ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addItem(p);
                                    toast.success(`${p.name} added to cart`);
                                  }}
                                  className="flex-1 inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground py-2.5 text-[10px] sm:text-xs uppercase tracking-wider font-semibold rounded hover:bg-charcoal transition"
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Add to Cart</span>
                                </button>
                              ) : null}
                              <button className="grid place-items-center w-9 sm:w-11 bg-background rounded hover:bg-accent transition">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="pt-3">
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-2.5 w-2.5 ${i < Math.round(p.rating ?? 0) ? "fill-accent text-accent" : "text-border"}`} />
                              ))}
                              <span className="text-[10px] text-muted-foreground ml-0.5">{p.rating?.toFixed(1) ?? "0.0"}</span>
                            </div>
                            {p.brandCountry && (
                              <div className="text-[10px] text-muted-foreground mb-0.5">
                                {COUNTRY_CODE[p.brandCountry] ? getFlagEmoji(COUNTRY_CODE[p.brandCountry]) : ""} {p.brandName && `${p.brandName} · `}{p.brandCountry}
                              </div>
                            )}
                            <h3 className="font-display text-sm font-medium text-foreground group-hover:text-primary transition line-clamp-2">{p.name}</h3>
                            <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                              <span className="font-semibold text-sm">Rs.{p.price}</span>
                              {p.comparePrice && (
                                <>
                                  <span className="text-xs text-muted-foreground line-through">
                                    Rs.{p.comparePrice}
                                  </span>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
