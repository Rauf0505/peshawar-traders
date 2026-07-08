import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { ArrowRight, MapPin } from "lucide-react";
import { Reveal, Stagger } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";

interface Props {
  brand: any;
  products: any[];
}

export function BrandPage({ brand, products }: Props) {
  const featured = brand.featuredProducts || [];

  return (
    <div className="bg-background text-foreground">
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
                <Link href="/brands" className="hover:text-white transition">Brands</Link>
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
                  href={`/products?brand=${brand.slug}`}
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
        {featured.length > 0 && (
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
                    href={`/products?brand=${brand.slug}`}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition"
                  >
                    View all products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featured.map((p: any) => (
                  <ProductCard key={p.sku} product={p} />
                ))}
              </Stagger>

              <div className="mt-16 text-center">
                <Link
                  href={`/products?brand=${brand.slug}`}
                  className="group inline-flex items-center gap-3 border border-border hover:border-primary text-foreground hover:text-primary px-8 py-4 text-sm font-semibold tracking-wide uppercase rounded-md transition-all duration-300"
                >
                  Explore All {brand.name} Products
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* All Products */}
        {products.length > 0 && (
          <section className="py-20 md:py-28 bg-background">
            <div className="container-x">
              <Reveal>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                  <div>
                    <span className="eyebrow">All Products</span>
                    <h2 className="mt-4 font-display text-4xl md:text-5xl font-medium leading-[1.05] max-w-xl">
                      Every <span className="italic text-primary">{brand.name}</span> Product
                    </h2>
                    <p className="mt-3 text-muted-foreground max-w-lg">
                      Browse the complete {brand.name} collection — {products.length} product{products.length > 1 ? "s" : ""} available.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((p: any) => (
                  <ProductCard key={p.sku} product={p} />
                ))}
              </Stagger>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
