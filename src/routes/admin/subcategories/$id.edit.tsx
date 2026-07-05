import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryFormPage } from "@/pages/admin/SubcategoryFormPage";

export const Route = createFileRoute("/admin/subcategories/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <SubcategoryFormPage editId={Number(id)} />;
}
