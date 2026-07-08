import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById } from "@/lib/api/products.server";
import { ProductPage } from "@/views/ProductPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  try {
    const { sku } = await params;
    const product = await getProductById({ data: { id: sku } });
    if (!product) return { title: "Product Not Found — Peshawar Traders" };
    return {
      title: `${product.name} — Peshawar Traders`,
      description: product.description?.slice(0, 160) || `${product.name} at Peshawar Traders.`,
      openGraph: {
        title: `${product.name} — Peshawar Traders`,
        description: product.description?.slice(0, 160),
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product — Peshawar Traders" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductById({ data: { id: sku } });
  if (!product) notFound();
  return <ProductPage product={product} />;
}
