import { createFileRoute } from "@tanstack/react-router";
import { OrderListPage } from "@/pages/admin/OrderListPage";

export const Route = createFileRoute("/admin/orders")({
  component: OrderListPage,
});
