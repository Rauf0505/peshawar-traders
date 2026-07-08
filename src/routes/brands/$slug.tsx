import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBrandBySlug, getProductsByBrand } from "@/lib/api/brands.server";
import { BrandPage } from "@/pages/BrandPage";

export const Route = createFileRoute("/brands/$slug")({
  loader: async ({ params }) => {
    const [brand, products] = await Promise.all([
      getBrandBySlug({ data: { slug: params.slug } }),
      getProductsByBrand({ data: { brandSlug: params.slug } }),
    ]);
    if (!brand) throw notFound();
    return { brand, products };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.brand.name} — Peshawar Traders` },
      { name: "description", content: loaderData.brand.description || `Explore ${loaderData.brand.name} products at Peshawar Traders.` },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { brand, products } = Route.useLoaderData();
  return <BrandPage brand={brand} products={products} />;
}
