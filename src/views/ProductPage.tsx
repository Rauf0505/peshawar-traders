"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShoppingBag, Check, Minus, Plus, Star, MessageCircle, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { ProductReviews } from "@/components/site/ProductReviews";
import { StarRating } from "@/components/site/StarRating";
import { getProductReviews } from "@/lib/api-client";

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);

  useEffect(() => { setSelected(0); }, [images]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary border border-border">
        <Image
          src={images[selected]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                i === selected
                  ? "border-primary ring-1 ring-primary/40"
                  : "border-border hover:border-muted-foreground/40"
              }`}
              style={{ width: 60, height: 60 }}
            >
              <Image src={img} alt="" width={60} height={60} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductPage({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const { addItem, openCart } = useCart();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const variants = product.variants || [];

  const varDefAttrs = useMemo(() => {
    const seen: Record<number, { id: number; name: string; type: string }> = {};
    for (const v of variants) {
      for (const opt of v.options) {
        if (!seen[opt.attributeId] && opt.attributeType !== "text") {
          seen[opt.attributeId] = { id: opt.attributeId, name: opt.attributeName, type: opt.attributeType };
        }
      }
    }
    return Object.values(seen);
  }, [variants]);

  const uniqueOptions = useMemo(() => {
    const map: Record<number, { value: string; meta: string | null }[]> = {};
    for (const v of variants) {
      for (const opt of v.options) {
        if (!map[opt.attributeId]) map[opt.attributeId] = [];
        if (!map[opt.attributeId].some((o) => o.value === opt.value)) {
          map[opt.attributeId].push({ value: opt.value, meta: opt.meta });
        }
      }
    }
    return map;
  }, [variants]);

  const selectedVariant = useMemo(() => {
    const keys = Object.keys(selectedOptions);
    if (keys.length === 0 || keys.length !== varDefAttrs.length) return null;
    return variants.find((v: any) =>
      v.options.every((o: any) => selectedOptions[o.attributeId] === o.value)
    ) || null;
  }, [selectedOptions, variants, varDefAttrs]);

  const displayImages = selectedVariant?.images?.length ? selectedVariant.images : product.images;
  const displayPrice = selectedVariant?.priceOverride ?? product.price;
  const displaySku = selectedVariant?.skuSuffix ? `${product.sku}-${selectedVariant.skuSuffix}` : product.sku;

  useEffect(() => {
    if (varDefAttrs.length > 0 && variants.length > 0) {
      const initial: Record<number, string> = {};
      for (const attr of varDefAttrs) {
        const vals = uniqueOptions[attr.id];
        if (vals && vals.length > 0) {
          initial[attr.id] = vals[0].value;
        }
      }
      setSelectedOptions(initial);
    }
  }, [varDefAttrs.length, variants.length]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await getProductReviews({ data: { productId: product.id } });
      setReviews(res || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating ?? 0;

  const handleAddToCart = () => {
    addItem({ ...product, price: displayPrice, sku: displaySku, images: displayImages }, qty);
    toast.success(`${product.name} added to cart`, {
      action: { label: "View Cart", onClick: () => openCart() },
    });
  };

  const stockColor =
    product.stockStatus === "In Stock"
      ? "text-green-500"
      : product.stockStatus === "Out of Stock"
      ? "text-red-500"
      : "text-purple-400";

  const stockDot =
    product.stockStatus === "In Stock"
      ? "bg-green-500"
      : product.stockStatus === "Out of Stock"
      ? "bg-red-500"
      : "bg-purple-400";

  const categoryAttrMap = useMemo(() => {
    const m: Record<string, { name: string; type: string }> = {};
    (product.categoryAttributes || []).forEach((ca: any) => {
      m[String(ca.attribute.id)] = { name: ca.attribute.name, type: ca.attribute.type };
    });
    return m;
  }, [product.categoryAttributes]);

  const attrEntries = Object.entries(product.attributes || {}) as [string, string][];

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <section className="py-8 md:py-20">
          <div className="container-x">

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Products
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

              <ImageGallery images={displayImages} name={product.name} />

              <div className="flex flex-col">

                {product.subcategory && (
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    {product.subcategory}
                  </p>
                )}

                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.08]">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={avgRating} size={14} />
                  <span className="text-xs text-muted-foreground ml-1">
                    {reviews.length > 0
                      ? `${avgRating.toFixed(1)} (${reviews.length} ${reviews.length === 1 ? "review" : "reviews"})`
                      : (product.rating ? `${product.rating.toFixed(1)}` : "—")}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-3 mt-4">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    Rs.{displayPrice?.toLocaleString()}
                  </span>
                  {product.comparePrice && (
                    <>
                      <span className="text-base text-muted-foreground line-through">
                        Rs.{product.comparePrice?.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                        {Math.round(
                          ((product.comparePrice - product.price) / product.comparePrice) * 100
                        )}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="border-t border-border mt-5 mb-5" />

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {varDefAttrs.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {varDefAttrs.map((attr) => {
                      const vals = uniqueOptions[attr.id] || [];
                      const current = selectedOptions[attr.id];
                      return (
                        <div key={attr.id}>
                          <label className="block text-xs font-medium text-muted-foreground mb-1.5">{attr.name}</label>
                          {attr.type === "color_swatch" ? (
                            <div className="flex flex-wrap gap-2">
                              {vals.map((v) => {
                                let hex = "#ccc";
                                try { if (v.meta) hex = JSON.parse(v.meta).hex || hex; } catch { console.debug("color meta parse"); }
                                return (
                                  <button
                                    key={v.value}
                                    type="button"
                                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [attr.id]: v.value }))}
                                    className={`w-9 h-9 rounded-full border-2 transition ${current === v.value ? "border-foreground ring-2 ring-foreground/30" : "border-border hover:border-muted-foreground/60"}`}
                                    style={{ backgroundColor: hex }}
                                    title={v.value}
                                  />
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {vals.map((v) => (
                                <button
                                  key={v.value}
                                  type="button"
                                  onClick={() => setSelectedOptions((prev) => ({ ...prev, [attr.id]: v.value }))}
                                  className={`px-3 h-8 text-xs font-medium rounded-md border transition ${
                                    current === v.value
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/60"
                                  }`}
                                >
                                  {v.value}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-5">
                  <span className={`h-2 w-2 rounded-full ${stockDot}`} />
                  <span className={`text-sm font-medium ${stockColor}`}>
                    {product.stockStatus}
                    {product.stockStatus !== "On Demand" && (
                      <span className="text-muted-foreground font-normal ml-1">
                        ({product.stockQuantity} available)
                      </span>
                    )}
                  </span>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {product.stockStatus === "On Demand" ? (
                    <a
                      href={getWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 px-6 text-xs uppercase tracking-[0.18em] font-semibold rounded-md hover:bg-green-700 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Inquire via WhatsApp
                    </a>
                  ) : (
                    <>
                      <div className="flex items-center border border-border rounded-md overflow-hidden self-stretch sm:self-auto">
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="grid place-items-center h-12 w-12 hover:bg-muted transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => setQty(qty + 1)}
                          className="grid place-items-center h-12 w-12 hover:bg-muted transition"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={product.stockStatus === "Out of Stock"}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-6 text-xs uppercase tracking-[0.18em] font-semibold rounded-md hover:bg-charcoal transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {product.stockStatus === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 text-foreground">
                    Product Details
                  </h3>
                  <dl className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                    {[
                      { label: "SKU", value: displaySku },
                      { label: "Brand", value: product.brandName || product.brand },
                      ...attrEntries.map(([attrId, val]) => {
                        const info = categoryAttrMap[attrId];
                        return { label: info?.name || `Attribute ${attrId}`, value: val };
                      }),
                    ]
                      .filter((d) => d.value)
                      .map((d) => (
                        <div key={d.label} className="flex flex-col gap-0.5">
                          <dt className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {d.label}
                          </dt>
                          <dd className="font-medium text-sm break-words">{d.value}</dd>
                        </div>
                      ))}
                  </dl>
                </div>

                {product.features?.length > 0 && (
                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 text-foreground">
                      Key Features
                    </h3>
                    <ul className="space-y-2.5">
                      {product.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <ProductReviews
              productId={product.id}
              reviews={reviews}
              loading={reviewsLoading}
              fetchReviews={fetchReviews}
            />

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
