import { notFound } from "next/navigation";
import { getProductById } from "@/lib/api/products.server";
import { ProductPage } from "@/views/ProductPage";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductById({ data: { id: sku } });
  if (!product) notFound();
  return <ProductPage product={product} />;
}
