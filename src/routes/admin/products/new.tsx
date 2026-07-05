import { createFileRoute } from "@tanstack/react-router";
import { ProductFormPage } from "@/pages/admin/ProductFormPage";

export const Route = createFileRoute("/admin/products/new")({
  component: () => <ProductFormPage />,
});
