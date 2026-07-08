import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { Products } from "@/components/site/Products";
import { Promo } from "@/components/site/Promo";
import { Features } from "@/components/site/Features";
import { Testimonials } from "@/components/site/Testimonials";
import { Brands as BrandsSection } from "@/components/site/Brands";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { getCategories } from "@/lib/api/products.server";
import { getHomePageProducts } from "@/lib/api/home-assignments.server";

export const metadata: Metadata = {
  title: "Peshawar Traders — Premium Tactical & Outdoor Gear",
  description:
    "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment from top brands like Snowpeak, Hatsan, and Artemis. Built for the wild. Trusted for life.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: any[] = [];
  let initialProducts: any[] = [];
  try {
    categories = await getCategories();
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
  try {
    initialProducts = await getHomePageProducts({ data: { tabSlug: "all" } });
  } catch (err) {
    console.error("Failed to load initial products:", err);
  }

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <Hero />
        <Categories categories={categories} />
        <Products initialProducts={initialProducts} />
        <Promo />
        <Features />
        <Testimonials />
        <BrandsSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
