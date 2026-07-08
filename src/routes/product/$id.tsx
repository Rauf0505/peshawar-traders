import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductById } from "@/lib/api/products.server";
import { ProductPage } from "@/pages/ProductPage";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const product = await getProductById({ data: { id: params.id } });
    if (!product) throw notFound();
    return product;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const product = Route.useLoaderData();
  return <ProductPage product={product} />;
}
