import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryListPage } from "@/pages/admin/SubcategoryListPage";

export const Route = createFileRoute("/admin/subcategories")({
  component: SubcategoryListPage,
});
