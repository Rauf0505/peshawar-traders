import { useEffect, useState } from "react";
import { Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getCategories, getProductsByCategory } from "@/lib/api/products.server";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";

export function CategoryPage({ categorySlug }: { categorySlug: string }) {
  const [category, setCategory] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCategories().then((cats: any) => {
      const found = cats.find((c: any) => c.slug === categorySlug);
      if (!found) return;
      setCategory(found);
      getProductsByCategory({ data: { categorySlug } }).then((products: any) => {
        setCategoryProducts(products);
        setLoaded(true);
      });
    });
  }, [categorySlug]);

  if (!loaded) return null;
  if (!category) throw notFound();

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="mb-4">
              <Link
                to="/shop"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                ← Back to Shop
              </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div className="max-w-xl">
                <span className="eyebrow">{categoryProducts.length} Products</span>
                <h1 className="mt-4 font-display text-4xl md:text-6xl font-medium leading-[1.05]">
                  {category.name}
                </h1>
                <p className="mt-4 text-muted-foreground text-lg">{category.description}</p>
              </div>
            </div>

            {categoryProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {categoryProducts.map((product, i) => (
                  <motion.div
                    key={product.sku}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group"
                  >
                    <Link to="/product/$id" params={{ id: product.sku }}>
                      <div className="relative aspect-square overflow-hidden bg-background rounded-md">
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
                          <span className="grid place-items-center w-9 sm:w-11 bg-background rounded hover:bg-accent hover:text-accent-foreground transition cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 sm:pt-4">
                        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {product.subcategory}
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
