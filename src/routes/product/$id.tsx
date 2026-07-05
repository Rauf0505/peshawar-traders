import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductById } from "@/lib/api/products.server";
import { ProductPage } from "@/pages/ProductPage";

export const Route = createFileRoute("/product/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const product = getProductById({ data: { id } });
  if (!product) throw notFound();
  return <ProductPage id={id} />;
}
