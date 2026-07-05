import { createFileRoute } from "@tanstack/react-router";
import { HomeControlPage } from "@/pages/admin/HomeControlPage";

export const Route = createFileRoute("/admin/home-control")({
  component: HomeControlPage,
});
