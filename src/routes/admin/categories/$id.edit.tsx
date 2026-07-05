import { createFileRoute } from "@tanstack/react-router";
import { CategoryFormPage } from "@/pages/admin/CategoryFormPage";

export const Route = createFileRoute("/admin/categories/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <CategoryFormPage editId={Number(id)} />;
}
