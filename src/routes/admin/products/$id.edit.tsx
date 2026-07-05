import { createFileRoute } from "@tanstack/react-router";
import { ProductFormPage } from "@/pages/admin/ProductFormPage";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ProductFormPage editId={Number(id)} />;
}
