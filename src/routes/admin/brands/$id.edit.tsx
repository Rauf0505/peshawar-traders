import { createFileRoute } from "@tanstack/react-router";
import { BrandFormPage } from "@/pages/admin/BrandFormPage";

export const Route = createFileRoute("/admin/brands/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <BrandFormPage editId={Number(id)} />;
}
