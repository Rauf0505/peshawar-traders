import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getProductById } from "@/lib/shop-data";
import { ShoppingBag, Check, Minus, Plus, Star } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const product = getProductById(params.id);
    return {
      meta: [
        { title: product ? `${product.name} — Peshawar Traders` : "Product — Peshawar Traders" },
        { name: "description", content: product?.metaDescription },
      ],
    };
  },
  component: ProductPage,
});

export function ProductPage() {
  const { id } = Route.useParams();
  const product = getProductById(id);

  if (!product) throw notFound();

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="mb-6">
              <Link
                to="/shop"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                ← Back to Shop
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="relative aspect-square overflow-hidden rounded-md bg-secondary">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.comparePrice && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 text-xs uppercase tracking-[0.18em] font-semibold rounded-md bg-destructive text-destructive-foreground">
                    Sale
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {product.subcategory}
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-medium leading-[1.05]">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-bold text-foreground">${product.price}</span>
                  {product.comparePrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.comparePrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(24 reviews)</span>
                </div>

                <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                      product.stockStatus === "In Stock"
                        ? "text-green-600"
                        : product.stockStatus === "Low Stock"
                          ? "text-orange-500"
                          : "text-red-500"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        product.stockStatus === "In Stock"
                          ? "bg-green-600"
                          : product.stockStatus === "Low Stock"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                    />
                    {product.stockStatus} ({product.stockQuantity} available)
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button className="grid place-items-center h-12 w-12 hover:bg-muted transition">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">1</span>
                    <button className="grid place-items-center h-12 w-12 hover:bg-muted transition">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 text-sm uppercase tracking-[0.18em] font-semibold rounded-md hover:bg-charcoal transition">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>

                <div className="mt-10 border-t border-border pt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] mb-4">
                    Product Details
                  </h3>
                  <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    {[
                      { label: "SKU", value: product.sku },
                      { label: "Brand", value: product.brand },
                      { label: "Material", value: product.material },
                      { label: "Weight", value: product.weight },
                      { label: "Dimensions", value: product.dimensions },
                      { label: "Color", value: product.color },
                    ].map((d) => (
                      <div key={d.label} className="flex flex-col">
                        <dt className="text-muted-foreground text-xs uppercase tracking-[0.15em]">
                          {d.label}
                        </dt>
                        <dd className="mt-0.5 font-medium">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {product.features.length > 0 && (
                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] mb-4">
                      Features
                    </h3>
                    <ul className="space-y-2">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
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
