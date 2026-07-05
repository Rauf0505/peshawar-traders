import { createFileRoute } from "@tanstack/react-router";
import { CategoryListPage } from "@/pages/admin/CategoryListPage";

export const Route = createFileRoute("/admin/categories")({
  component: CategoryListPage,
});
