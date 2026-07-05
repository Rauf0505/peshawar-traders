import { createFileRoute } from "@tanstack/react-router";
import { CategoryFormPage } from "@/pages/admin/CategoryFormPage";

export const Route = createFileRoute("/admin/categories/new")({
  component: () => <CategoryFormPage />,
});
