import { createFileRoute } from "@tanstack/react-router";
import { BrandListPage } from "@/pages/admin/BrandListPage";

export const Route = createFileRoute("/admin/brands")({
  component: BrandListPage,
});
