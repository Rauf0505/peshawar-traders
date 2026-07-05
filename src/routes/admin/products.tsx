import { createFileRoute } from "@tanstack/react-router";
import { ProductListPage } from "@/pages/admin/ProductListPage";

export const Route = createFileRoute("/admin/products")({
  component: ProductListPage,
});
