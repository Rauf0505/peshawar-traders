import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getProducts, getCategories } from "@/lib/api/products.server";
import { Search, Star, Eye, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export function ShopPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortValue>("default");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setAllProducts(prods);
      setCategories(cats);
      setLoaded(true);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (activeCategory !== "all") {
      const cat = categories.find((c: any) => c.slug === activeCategory);
      if (cat) {
        result = result.filter((p) => p.categoryName === cat.name);
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.subcategoryName || "").toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [search, activeCategory, sort, allProducts, categories]);

  if (!loaded) return null;

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="max-w-2xl mb-10">
              <span className="eyebrow">Tactical & Outdoor Gear</span>
              <h1 className="mt-4 font-display text-4xl md:text-6xl font-medium leading-[1.05]">
                Shop <span className="italic text-primary">all</span> products.
              </h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-lg">
                Precision airguns, tactical apparel, optics, field tools — everything you need for
                the mission.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-10 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
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
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortValue)}
                  className="h-12 px-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border transition ${
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                All
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border transition ${
                    activeCategory === cat.slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="text-sm text-muted-foreground mb-8">
              Showing{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span> product
              {filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "all" &&
                ` in ${categories.find((c: any) => c.slug === activeCategory)?.name}`}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-muted-foreground mb-2">
                  <Search className="h-10 w-10 mx-auto opacity-40" />
                </div>
                <p className="text-lg font-medium text-foreground">No products found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setSort("default");
                  }}
                  className="mt-4 px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full bg-primary text-primary-foreground hover:bg-charcoal transition"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.sku}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                  >
                    <Link
                      to="/product/$id"
                      params={{ id: product.sku }}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-background rounded-md border border-border/40">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
                        />
                        {product.comparePrice && (
                          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-destructive text-destructive-foreground">
                            Sale {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                          </span>
                        )}
                        {product.stockStatus === "On Demand" && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-purple-600 text-white">
                            On Demand
                          </span>
                        )}
                        {product.stockStatus === "Low Stock" && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-accent text-accent-foreground">
                            Low Stock
                          </span>
                        )}
                        {product.stockStatus === "Out of Stock" && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold rounded bg-red-600 text-white">
                            Out of Stock
                          </span>
                        )}
                        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex gap-1.5 sm:gap-2">
                          <span className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 bg-primary text-primary-foreground py-2 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold rounded hover:bg-charcoal transition cursor-pointer">
                            <ShoppingBag className="h-3.5 w-3.5" /> <span className="hidden xs:inline">Add</span>
                          </span>
                          <span className="grid place-items-center w-9 sm:w-11 bg-background rounded hover:bg-accent hover:text-accent-foreground transition cursor-pointer" aria-label="Quick view">
                            <Eye className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 sm:pt-4">
                        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                                i < Math.round(product.rating ?? 0)
                                  ? "fill-accent text-accent"
                                  : "text-border"
                              }`}
                            />
                          ))}
                          <span className="text-[10px] sm:text-[11px] text-muted-foreground ml-1">
                            {product.rating ? product.rating.toFixed(1) : "0.0"}
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {product.subcategoryName || product.subcategory}
                        </div>
                        <h3 className="mt-1 font-display text-sm sm:text-base md:text-lg font-medium text-foreground group-hover:text-primary transition line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                          <span className="text-foreground font-semibold text-sm sm:text-base">${product.price}</span>
                          {product.comparePrice && (
                            <>
                              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                ${product.comparePrice}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
