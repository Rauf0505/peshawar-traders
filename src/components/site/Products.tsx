"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, Stagger } from "./Reveal";
import { getHomePageProducts } from "@/lib/api-client";
import { ProductCard } from "./ProductCard";

const tabs = [
  { slug: "all", label: "All" },
  { slug: "weapons", label: "Weapons" },
  { slug: "optics", label: "Optics" },
  { slug: "apparel", label: "Apparel" },
  { slug: "tools", label: "Tools" },
];

function ProductSkeleton() {
  return (
    <div className="group block">
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-muted rounded-md animate-pulse" />
        <div className="pt-3 sm:pt-5 space-y-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-muted rounded" />
            ))}
          </div>
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function Products({ initialProducts }: { initialProducts: any[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(false);
  const latestTabRef = useRef("all");

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const requestedTab = activeTab;
    latestTabRef.current = requestedTab;
    setLoading(true);

    getHomePageProducts({ data: { tabSlug: requestedTab } })
      .then((data) => {
        if (latestTabRef.current !== requestedTab) return;
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (latestTabRef.current !== requestedTab) return;
        console.error("Failed to fetch products for tab:", requestedTab, err);
        setProducts([]);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <section id="products" className="py-24 md:py-32 bg-secondary">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="eyebrow">Featured Products</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] max-w-xl">
                Tested in the <span className="italic text-primary">field</span>.
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tabs.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setActiveTab(t.slug)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] rounded-full border transition ${activeTab === t.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No products assigned to this tab yet.</p>
            {activeTab !== "all" && (
              <p className="text-sm mt-2 opacity-60">Add products from the admin panel → Home Control.</p>
            )}
          </div>
        ) : (
          <Stagger key={activeTab} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
