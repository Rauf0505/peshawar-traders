import { createFileRoute } from "@tanstack/react-router";
import { BrandFormPage } from "@/pages/admin/BrandFormPage";

export const Route = createFileRoute("/admin/brands/new")({
  component: () => <BrandFormPage />,
});
