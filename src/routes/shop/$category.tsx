import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { categories, getProductsByCategory } from "@/lib/shop-data";
import { ArrowRight, Star, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.category);
    return {
      meta: [{ title: `${cat?.name || "Category"} — Peshawar Traders` }],
    };
  },
  component: CategoryPage,
});

export function CategoryPage() {
  const { category: categorySlug } = Route.useParams();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) throw notFound();

  const categoryProducts = getProductsByCategory(categorySlug);

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
                <span className="eyebrow">{category.count} Products</span>
                <h1 className="mt-4 font-display text-4xl md:text-6xl font-medium leading-[1.05]">
                  {category.name}
                </h1>
                <p className="mt-4 text-muted-foreground text-lg">{category.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  to="/shop/$category"
                  params={{ category: categorySlug }}
                  hash={sub.slug}
                  className="px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border border-border hover:border-primary hover:text-primary transition"
                >
                  {sub.name}
                </Link>
              ))}
            </div>

            {categoryProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-md bg-destructive text-destructive-foreground">
                            Sale
                          </span>
                        )}
                        {product.stockStatus === "Low Stock" && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-md bg-accent text-accent-foreground">
                            Low Stock
                          </span>
                        )}
                        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex gap-2">
                          <span className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-xs uppercase tracking-[0.18em] font-semibold rounded-md hover:bg-charcoal transition cursor-pointer">
                            <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                          </span>
                          <span className="grid place-items-center w-11 bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {product.subcategory}
                        </div>
                        <h3 className="mt-1 font-display text-lg font-medium text-foreground group-hover:text-primary transition">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-foreground font-semibold">${product.price}</span>
                          {product.comparePrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.comparePrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {product.stockStatus}
                          </span>
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
