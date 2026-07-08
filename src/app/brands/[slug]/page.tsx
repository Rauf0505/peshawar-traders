import { notFound } from "next/navigation";
import { getBrandBySlug, getProductsByBrand } from "@/lib/api/brands.server";
import { BrandPage } from "@/views/BrandPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandBySlug({ data: { slug } });
  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name} — Peshawar Traders`,
    description: brand.description || `Explore ${brand.name} products at Peshawar Traders.`,
  };
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brand, products] = await Promise.all([
    getBrandBySlug({ data: { slug } }),
    getProductsByBrand({ data: { brandSlug: slug } }),
  ]);
  if (!brand) notFound();
  return <BrandPage brand={brand} products={products} />;
}
