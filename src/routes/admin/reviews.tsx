import { createFileRoute } from "@tanstack/react-router";
import { ReviewListPage } from "@/pages/admin/ReviewListPage";

export const Route = createFileRoute("/admin/reviews")({
  component: ReviewListPage,
});
