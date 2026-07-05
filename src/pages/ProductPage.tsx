import { useEffect, useState } from "react";
import { Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getProductById } from "@/lib/api/products.server";
import { ShoppingBag, Check, Minus, Plus, Star } from "lucide-react";

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-secondary">
        <img
          src={images[selected]}
          alt={name}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative size-20 shrink-0 rounded-md overflow-hidden border-2 transition ${
                i === selected
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProductById({ data: { id } }).then((p) => {
      setProduct(p);
      setLoaded(true);
    });
  }, [id]);

  if (!loaded) return null;
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
              <ImageGallery images={product.images} name={product.name} />

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
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.comparePrice}
                      </span>
                      <span className="text-lg font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                      </span>
                    </>
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
                        : product.stockStatus === "Out of Stock"
                        ? "text-red-500"
                        : "text-purple-500"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        product.stockStatus === "In Stock"
                          ? "bg-green-600"
                          : product.stockStatus === "Out of Stock"
                          ? "bg-red-500"
                          : "bg-purple-500"
                      }`}
                    />
                    {product.stockStatus}
                    {product.stockStatus !== "On Demand" && (
                      <> ({product.stockQuantity} available)</>
                    )}
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  {product.stockStatus === "On Demand" ? (
                    <div className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-600/20 text-purple-400 py-3 px-6 text-sm uppercase tracking-[0.18em] font-semibold rounded-md border border-purple-500/30">
                      <span>Contact for Availability</span>
                    </div>
                  ) : (
                  <>
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
                  </>
                  )}
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
                      {product.features.map((f: string, i: number) => (
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
