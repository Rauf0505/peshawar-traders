import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryFormPage } from "@/pages/admin/SubcategoryFormPage";

export const Route = createFileRoute("/admin/subcategories/new")({
  component: () => <SubcategoryFormPage />,
});
