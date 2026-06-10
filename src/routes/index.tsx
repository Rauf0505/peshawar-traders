import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { Products } from "@/components/site/Products";
import { Promo } from "@/components/site/Promo";
import { Features } from "@/components/site/Features";
import { Testimonials } from "@/components/site/Testimonials";
import { Brands } from "@/components/site/Brands";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peshawar Traders — Premium Tactical & Outdoor Gear" },
      {
        name: "description",
        content:
          "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment. Built for the wild. Trusted for life.",
      },
      { property: "og:title", content: "Peshawar Traders — Premium Tactical & Outdoor Gear" },
      {
        property: "og:description",
        content:
          "Premium airguns, tactical vests, pouches, pellets, and field-tested outdoor equipment.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Products />
        <Promo />
        <Features />
        <Testimonials />
        <Brands />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
